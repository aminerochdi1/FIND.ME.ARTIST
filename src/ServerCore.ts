import { ProfileBuilder } from "./builders/ProfileBuilder";
import ConversationMessage from "./classes/conversations/ConversationMessage";
import ConversationProfile from "./classes/conversations/ConversationProfile";
import DuoConversation from "./classes/conversations/DuoConversation";
import { MailHandler } from "./handler/MailHandler";
import AuthenticationPacket from "./packets/AuthenticationPacket";
import MessagePacket from "./packets/MessagePacket";
import OpenConversationPacket from "./packets/OpenConversationPacket";
import ReadMessagePacket from "./packets/ReadMessagePacket";
import YouHaveNewConversation from "./packets/YouHaveNewConversation";
import Chat from "./sides/server/Chat";
import SessionHandler from "./sides/server/SessionHandler";
const { Profile } = require("../models")

class ServerCore {

  constructor() {
  }

  socketsConnected: any[] = [];
  sequelize: any;

  /**
   * ServerCore permet de faire communiquer les clients entre eux avec la messagerie,
   * de savoir si un client est en ligne
   * 
   * # Lorsqu'un client se connecte ils doit indiquer quels conversation ils 
   * comptent écouter afin de recevoir les messages de la conversation en temps réel
   * 
   * # Lorsqu'un client ouvre une discussion pour la première fois la discussion s'ouvre 
   * de l'autre coté du client
  */

  start() {
    const env = process.env.NODE_ENV || 'development';
    console.log("Starting for " + env + " app")
    this.sequelize = require("../models").sequelize;

    this.sequelize.authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((error: any) => {
        console.error('Unable to connect to the database:', error);
      });

  }

  getSocket(socket: any) {
    return this.socketsConnected.indexOf(socket);
  }

  disconnect(socket: any) {
    const address = socket.request.connection.remoteAddress;
    const index = this.getSocket(socket)
    if (index !== -1)
      this.socketsConnected.splice(index, 1);
    console.log("[" + address + "] " + (socket.profile && (socket.profile.firstname + " " + socket.profile.lastname)) + " disconnected.")
  }

  selfSocket(socket: any) {
    setTimeout(() => {
      if (!socket.authorized) {
        const address = socket.request.connection.remoteAddress;
        console.log("[" + address + "] Socket kicked by server because is not authenticated")
        socket.disconnect();
      }
    }, 5000);
  }

  connection(socket: any) {
    const address = socket.request.connection.remoteAddress;
    console.log("Socket connected : " + address);
    this.socketsConnected.push(socket)

    socket.on("disconnect", () => {
      this.disconnect(socket)
    })

    /**
     * Attention cela marche mais pour éviter le surchargement de la base de données
     * les informations du profile ne sont pas dynamique et sont charger uniquement
     * à la connexion du client
     * 
     * (pour les target)
    */
    /*
     socket.on("open", async (data: OpenConversationPacket) => {
       if (data.profile_id == socket.profile.id) return;
 
       const { success, message, user } = await SessionHandler.checkSession(socket.token);
       if (success) {
         const conversation_id = await Chat.openConversation(socket.profile.id, data.profile_id);
 
         if(conversation_id && !socket.conversations.includes(conversation_id)){
           const profile = await user.getProfile();
           const target = this.socketsConnected.find((socket) => profile.id == data.profile_id);
           const conversationProfile = await ProfileBuilder.build(profile);
           const conversationProfileTarget = target ? await ProfileBuilder.build(target.profile) : await Profile.findOne({where: {id: data.profile_id}});
 
           socket.emit("conversation", new DuoConversation(conversation_id, conversationProfileTarget, undefined))
           socket.conversations.push(conversation_id);
           
           if(target){
 
             target.conversations.push(conversation_id);
             target.emit("conversation", new DuoConversation(conversation_id, conversationProfile, undefined))
           }
         }
       }
     });*/

    socket.on("authentication", async (data: AuthenticationPacket) => {
      const token = data.token;

      console.log("socket try to connect with token : " + token)
      const { success, message, user } = await SessionHandler.checkSession(token)
      if (success) {
        const profile = await user.getProfile();
        socket.profile = profile;
        socket.token = token;
        socket.authorized = true;
        socket.conversations = [];

        console.log("[" + this.socketsConnected.length + "] Socket authenticated : " + profile.firstname + " " + profile.lastname + "#" + profile.id);
        const listConversations = await Chat.listConversations(profile.id);
        listConversations.map((conversation: DuoConversation) => {
          socket.conversations.push(conversation.id);
        })
      } else {
        console.log("Socket authentifcation failed " + address);
      }
    });

    socket.on("open", async (data: OpenConversationPacket) => {
      if (!socket.authorized) return;

      // On vérifie l'existance de cette conversation
      const conversation = await Chat.getConversationByInterlocutor(socket.profile.id, data.conversation_id);
      console.log(conversation)
      if (conversation != undefined) {
        // Maintenant on regarde si l'utilisateur ciblé est connecté ou pas
        const target = this.socketsConnected.find((socket) => socket.profile.id == conversation.profile.id);
        if (target != undefined) {
          const targetConversation = await Chat.getConversation(socket.profile.id, data.conversation_id);
          // Si il est connecté on lui envoie la conversation pour mettre son clients à jour
          console.log("send conversation", targetConversation)
          target.emit("conversation", new YouHaveNewConversation(targetConversation))
          target.conversations.push(targetConversation.id);
        }
      }
    })

    socket.on("message", async (data: MessagePacket) => {
      if (!socket.authorized) return;
      /*
       Attention de pas envoyer ce message aux utilisateurs qui ne serait pas lien avec cette conversation
      */
      const message = await Chat.sendMessage(socket.token, data.conversation_id, data.message);

      if (message) {
        console.log(message);
        console.log("[" + socket.profile.firstname + " " + socket.profile.lastname + "][" + this.socketsConnected.length + "][" + new Date().toTimeString() + "] send message " + message.message)

        const sockets = this.socketsConnected.filter((socket) => socket.conversations.includes(message.conversation_id));
        sockets.map((socket_) => {
          console.log("send to : " + socket_.profile.firstname)
          socket_.emit("message", message);
        })

        const conversation = await Chat.getConversationByProfile(socket.profile.id, data.conversation_id);
        const profiles = (await conversation.listProfiles()).filter((profile:any) => profile.id != socket.profile.id);

        
        profiles.map(async (profile:any) => {
          const socket = this.socketsConnected.find((socket:any) => socket.profile.id == profile.id)
          console.log(socket)
          if(!socket){
            const user = await profile.getUser();
            MailHandler.sendMail(MailHandler.MailType.NEW_MESSAGE, user.language, user.email)
          }
        })
      }
    })
    socket.on("read", async (data: ReadMessagePacket) => {
      if (!socket.authorized) return;

      console.log("read", data)
      if (data == undefined || data.conversation_id == undefined || data.message_id == undefined) return;

      const message = await Chat.getMessageWithConversationId(data.conversation_id, socket.profile.id, data.message_id)

      console.log(message);
      if (message) {
        message.update({ read: true })
        this.socketsConnected.filter((socket) => socket.conversations.includes(message.conversation_id)).map((socket_) => {
          if (socket_.profile.id != socket.profile.id)
            socket_.emit("read", data);
        })
      }
    })
    this.selfSocket(socket);
  }
}

export default ServerCore;