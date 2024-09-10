import Head from 'next/head'
import '@splidejs/splide/dist/css/splide.min.css'; // Import Splide.css
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { ServerSide } from '@/sides/server/ServerSide';
import JobsAPI from '@/api/JobsAPI';
import { ClientSide } from '@/sides/client/ClientSide';
import { useEffect, useRef, useState } from 'react';
import ChatAPI from '@/api/ChatAPI';
import { getSession } from '@/handler/session';
import DuoConversation from '@/classes/conversations/DuoConversation';
import { buildMediaURL } from '@/utils/client.utils';
import config from "../../../config.json";
import { CountriesHandler } from '@/handler/CountriesHandler';
import Link from 'next/link';
import Chat from '@/sides/server/Chat';
import ProfileHandler from '@/sides/server/ProfileHandler';
import Input from '@/components/Input';
import ConversationMessage from '@/classes/conversations/ConversationMessage';
import { buildProfileRoute } from '@/handler/router';
import { io } from 'socket.io-client';
import AuthenticationPacket from '@/packets/AuthenticationPacket';
import MessagePacket from '@/packets/MessagePacket';
import { RoleType } from '@/classes/RoleType';
import OpenConversationPacket from '@/packets/OpenConversationPacket';
import YouHaveNewConversation from '@/packets/YouHaveNewConversation';
import ReadMessagePacket from '@/packets/ReadMessagePacket';

export default function Search(
    props: {
        host: string,
        lang: string,
        title: string,
        user?: any,
        conversation: number, /*,
        target?: number*/
    }) {

    /* SOCKET */
    const [socket, setSocket] = useState<any>(undefined);
    const [connected, setConnected] = useState<boolean | undefined>(undefined);

    /* CHAT */
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [conversation, setConversation] = useState<DuoConversation | undefined>(undefined);
    const [cancelScrollToBottom, setCancelScrollToBottom] = useState(false);
    const chatboxReferences = useRef<any>(null);

    const isConnected = () => {
        return socket != undefined && socket.connected;
    }

    useEffect(() => {
        try {
            const { protocol, hostname } = window.location;
            const url = `${protocol}//${hostname}:8081`;
            const socket = io(url);
            setSocket(socket);

            socket.on('connect', async () => {
                setConnected(true);
                await socket.emit("authentication", new AuthenticationPacket(getSession()))
                if (props.conversation != undefined) {
                    socket.emit("open", new OpenConversationPacket(props.conversation))
                }
                setTimeout(() => {
                    setConnected(undefined)
                }, 1400)
            });

            socket.on('disconnect', () => {
                setConnected(false)
            });

            return () => {
                socket.disconnect();
            };
        } catch (error) {
            console.error(error)
        }
    }, []);

    /*
    const handleScroll = () => {
        if (chatboxReferences.current == null) return;

        if (chatboxReferences.current.scrollTop === 0) {
            moreMessages(); 
        }
    };*/

    useEffect(() => {
        try {
            socket.removeAllListeners("message");
            socket.removeAllListeners("read");

            socket.on("read", (data: ReadMessagePacket) => {
                if (conversation != undefined && conversation.id == data.conversation_id) {
                    setMessages((messages: ConversationMessage[]) =>
                        messages.map((message: ConversationMessage) => {
                            if (message.id == data.message_id) { message.read = true }
                            return message;
                        }))
                }
            });
            socket.on("message", (data: ConversationMessage) => {
                if (conversation != undefined && conversation.id == data.conversation_id) {
                    appendMessage(data);
                    if (data.profile.id != user.profile.id) {
                        socket.emit("read", new ReadMessagePacket(data.conversation_id, data.id))
                        
                        ChatAPI.readMessage(getSession(), data.profile.id, data.id)
                        
                    }
                } else {
                    setConversations(conversations.map((conversation: DuoConversation) => {
                        if (data.conversation_id == conversation.id) {
                            conversation.has_messages++;
                        }
                        return conversation;
                    }))
                }
            });
        } catch (error) {
            console.error(error)
        }

        
        // if (chatboxReferences.current == null) return;
        // chatboxReferences.current.addEventListener('scroll', handleScroll);

        // return () => {
        //     chatboxReferences.current.removeEventListener('scroll', handleScroll);
        // }
        
    }, [conversation]);

    const lang = props.lang;

    ClientSide.setLanguage(props.lang)
    const translate = useTranslation().t;

    const user = props.user != undefined ? ClientSide.parseUser(props.user) : undefined;
    const [conversations, setConversations] = useState<DuoConversation[]>([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const conversations_ = await ChatAPI.listConversations(getSession());
            setConversations(conversations_);
            if (props.conversation != undefined) {
                const f = conversations_.find((conversation: DuoConversation) => conversation.id == props.conversation);
                if (f) {
                    updateConversation(f)
                }
            }
        }
        fetchConversations();
    }, [])

    useEffect(() => {
        if (socket == undefined) return;
        socket.removeAllListeners("conversation");
        socket.on('conversation', (data: YouHaveNewConversation) => {
            if ((conversations.find((conversation) => conversation.id == data.conversation.id)) != undefined) return;
            setConversations((conversations) => [...conversations, data.conversation])
            // updateConversation(data.conversation); ne pas forcement ouvrir la discussion
        });
    }, [socket, conversations])

    useEffect(() => {
        if (cancelScrollToBottom) {
            setCancelScrollToBottom(false)
            return;
        }
        scrollToLastMessage();
    }, [messages])

    const appendMessage = (conversationMessage: ConversationMessage) => {
        setTotal((total: number) => total + 1);
        setMessages((messages) => [...(messages.map((message) => { if (message.isLast) { message.isLast = false } return message })), conversationMessage])
    }

    const sendMessage = async () => {
        if (conversation == undefined) return;
        setSubmitting(true);
        const conversationMessage: ConversationMessage = await ChatAPI.sendMessageToConversation(getSession(), conversation.id, message);
        if (isConnected())
            await socket.emit("message", new MessagePacket(conversation.id, message));
        setSubmitting(false);
        setMessage("");

        
        // if (conversationMessage != undefined) {
        //     setMessage("");
        //     appendMessage(conversationMessage);
        // }
    }

    const scrollToLastMessage = () => {
        if (chatboxReferences.current != null) {
            const scrollableElement: any = chatboxReferences.current;
            scrollableElement.scrollTop = scrollableElement.scrollHeight;
        }
    }

    const moreMessages = async () => {
        if (conversation == undefined) return;
        const conversation_id = conversation.id;

        const from = (messages != undefined && messages.length > 0) ? messages[0].id : undefined;
        if (from == undefined) return;

        setCancelScrollToBottom(true);
        await fetchMessages(conversation_id, from);
    }

    const fetchMessages = async (conversation_id: number, from?: number) => {
        const data = await ChatAPI.getRecentsMessagesOfConversation(getSession(), conversation_id, from);

        const messages_: ConversationMessage[] = data.messages;
        const total: number = data.total;
        setTotal(total);

        messages_.map((message) => {
            if (!message.read && socket != undefined) {
                socket.emit("read", new ReadMessagePacket(message.conversation_id, message.id))
            }
        })

        if (from != undefined)
            return setMessages((messages) => [...messages_, ...messages]);
        setMessages(messages_)
    }


    const updateConversation = (conversation: DuoConversation) => {
        setConversations((conversations: DuoConversation[]) =>
            conversations.map((conversation_: DuoConversation) => {
                if (conversation.id == conversation_.id) {
                    conversation_.has_messages = 0;
                }
                return conversation_;
            })
        )
        setConversation(conversation);
        fetchMessages(conversation.id);
        setShowConversation(false)
    }

    const CirclePlaceholder = (props: { size: string }) => {

        const size = props.size;

        return (
            <div className="bg-light rounded-circle" style={{ minWidth: size, minHeight: size, maxWidth: size, maxHeight: size }}></div>
        )
    }

    const ConversationPlaceholder = () => {

        return (
            <div className="d-flex p-2 opacity-75">
                <CirclePlaceholder size={"5rem"} />
                <div className="ms-3 d-flex flex-column justify-content-center w-100 gap-1">
                    <span className="placeholder bg-light col-7"></span>
                    <span className="placeholder bg-light col-4"></span>
                    <span className="placeholder bg-light col-8"></span>
                </div>
            </div>
        )
    }

    const Conversation = (conversation: DuoConversation) => {

        const profile = conversation.profile;

        return (
            <div tabIndex={1} onClick={(e) => { updateConversation(conversation) }} className="d-flex p-2 opacity-75 clickable border-bottom py-3">
                <img className="profile-picture" src={buildMediaURL(profile.picture ?? "")} alt="" />
                <div className="ms-3 d-grid flex-column justify-content-center align-items-center text-prevent-back-line">
                    <span className="text-black fs-5 fw-bold mb-0 lh-1">{profile.firstname} {profile.lastname}</span>
                    <span className="text-black">{profile.role == RoleType.RECRUITER ? translate("recruiter") : translate(profile.jobs[0].name)}</span>
                </div>
                {
                    conversation.has_messages > 0 && (
                        <div className="notification">{conversation.has_messages}</div>
                    )
                }
            </div>
        )
    }

    const ConversationsPlaceholder = () => {
        return (
            <>
                <ConversationPlaceholder />
                <ConversationPlaceholder />
                <ConversationPlaceholder />
                <ConversationPlaceholder />
                <ConversationPlaceholder />
                <ConversationPlaceholder />
                <ConversationPlaceholder />
                <ConversationPlaceholder />
            </>
        )
    }

    const ProfilePlaceholder = () => {
        return (
            <div className="p-5 flex-grow-1 d-flex flex-column opacity-75 ">
                <div className="h-100 d-flex flex-column gap-1 align-items-center">
                    <CirclePlaceholder size={"8rem"} />
                    <div className="d-flex flex-column gap-1 w-100 align-items-center mt-3">
                        <span className="placeholder bg-light col-5"></span>
                        <span className="placeholder bg-light col-4"></span>
                        <span className="placeholder bg-light col-8"></span>
                    </div>
                    <div className="my-auto w-100 ">
                        <span className="placeholder bg-light col-12"></span>
                        <span className="placeholder bg-light col-12"></span>
                        <span className="placeholder bg-light col-12"></span>
                    </div>
                    <div className="w-100 d-flex flex-column gap-1 align-items-center">
                        <span className="placeholder bg-light col-8"></span>
                        <div className="d-flex mt-1 gap-2 w-50">
                            <CirclePlaceholder size={"1rem"} />
                            <span className="placeholder bg-light col-10"></span>
                        </div>
                        <div className="d-flex mt-1 gap-2 w-50">
                            <CirclePlaceholder size={"1rem"} />
                            <span className="placeholder bg-light col-10"></span>
                        </div>
                        <div className="d-flex mt-1 gap-2 w-50">
                            <CirclePlaceholder size={"1rem"} />
                            <span className="placeholder bg-light col-10"></span>
                        </div>
                    </div>
                    <span className="mt-5 placeholder bg-light col-10"></span>
                    <div className="d-flex gap-2 mt-2">
                        <CirclePlaceholder size={"2rem"} />
                        <CirclePlaceholder size={"2rem"} />
                        <CirclePlaceholder size={"2rem"} />
                        <CirclePlaceholder size={"2rem"} />
                    </div>
                </div>
            </div>
        )
    }

    const ProfileInformation = (profile: any) => {
        const genders: string[] = config.genders.map((gender) => translate(gender));
        const gendersIcons = [
            <i className="fa-solid fa-venus me-2" key={1}></i>,
            <i className="fa-solid fa-mars me-2" key={2}></i>
        ]

        const socialNetworks: any = require('@/assets/socialnetworks').default;
        const flags: any = require("@/assets/flags.json");

        return (
            <div className="bg-white border border-bottom-0 border-top-0 h-100">
                <Link href={buildProfileRoute(lang, profile.firstname, profile.lastname, profile.id)} className="text-decoration-none text-black d-flex flex-column pt-3">
                    {
                        profile.picture != null ?
                            (
                                <img className="mx-auto profile-picture" src={buildMediaURL(profile.picture)} alt={profile.firstname + " " + profile.lastname} />
                            ) : (
                                <i style={{ fontSize: "6rem" }} className="text-center text-black me-2 fa-solid fa-circle-user"></i>
                            )
                    }
                    <h1 className="fs-4 text-center fw-semibold pt-3 text-initial">{profile.firstname} {profile.lastname}</h1>
                    <div className="mx-auto">
                        <ul className="list-unstyled">
                            <li><i className="fa-solid fa-location-dot me-2"></i> {profile.city}, {translate(CountriesHandler.getCountryCommon(profile.country))}</li>
                            <li>{gendersIcons[profile.gender]} {genders[profile.gender]}</li>
                        </ul>
                    </div>
                </Link>
                <div className="border-bottom px-5 py-3">
                    <h2 className="fs-4 pt-1 pb-2">{translate("description")}</h2>
                    <p className="lh-sm small">{profile.description}</p>
                </div>
                <div className="border-bottom px-5 py-3">
                    <h2 className="fs-4 pt-1 pb-2">{translate("languages_speak")}</h2>
                    <ul className="list-unstyled">
                        {profile.languages_speaks.map((language: string, index: number) => {
                            return <li key={index} className="fw-semibold"><span className="me-2">{flags[language]}</span>{translate(language)}</li>
                        })}
                    </ul>
                </div>
                <div className="px-5 py-3">
                    <h2 className="fs-4 pt-1 pb-2">{translate("social_networks")}</h2>
                    <div className="row">
                        {Object.keys(socialNetworks).map((key: any, index: number) => {
                            if (profile.socialnetworks[key] == null) return;
                            return (
                                <div key={index} className="col-auto">
                                    <Link target="_blank" rel="noopener noreferrer" className="text-black fs-2" href={profile.socialnetworks[key]}><i className={"fa-brands fa-" + key}></i></Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div >
        )
    }

    let last_time: number = 0;

    const Message = (message: ConversationMessage) => {

        const message_of_user = message.profile.id != user.profile.id;
        const message_ = message.message;

        const time: number = new Date(message.createdAt).getTime();
        const showTime = false /*last_time == undefined || ((time - last_time) / 10000) > 5*/;
        last_time = time;

        return (
            <div className="d-flex flex-column justify-content-center">
                <div className={"text-white rounded-5 px-3 py-2 " + (message_of_user ? "bg-secondary ms-auto" : "bg-primary me-auto")} style={{ maxWidth: "80%" }}>
                    <p style={{ wordWrap: "break-word" }} className="lh-sm mb-0">
                        {message_}
                    </p>
                </div>
                {
                    (message.profile.id == user.profile.id && message.isLast && message.read) && (
                        <span className={"text-dark small w-auto px-2" + (message_of_user ? "ms-auto" : "me-auto")} >vue</span>
                    )
                }
                {showTime && (
                    <span className={"small text-muted mt-1" + (message_of_user ? " pe-2 ms-auto" : " ps-2 me-auto")}>{new Date(message.createdAt).toLocaleTimeString()}</span>
                )}
            </div>
        )
    }

    const ChatBox = () => {
        return (
            <div className="d-flex flex-column flex-grow-1 w-100 gap-2">
                <div ref={chatboxReferences} className="position-relative h-100 overflow-auto">
                    <div className="position-absolute w-100 d-flex flex-column gap-2 position-relative justify-content-end px-3 pb-2 px-md-4 pt-2 pt-md-3">
                        {(messages != undefined && messages.length > 0 && messages.length < total) && (
                            <span onClick={(e) => moreMessages()} className="border p-2 w-100 text-center text-clickable clickable fs-5">{translate("show_others_messages").replace("%count%", (total - messages.length) + "")}</ span>
                        )}
                        {messages != undefined && messages.sort((a: ConversationMessage, b: ConversationMessage) => a.id - b.id /*new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()*/).map((message: ConversationMessage) => {
                            return Message(message)
                        })}
                    </div>
                </div>
                <div className="d-flex pt-3 gap-2 w-100 bg-light px-1 px-md-4 pb-1 pb-md-2 ">
                    <Input disabled={submitting || !isConnected() || conversation == undefined} onKeyPress={(e: any) => { if (e.key == 'Enter') sendMessage() }} onChange={(v: string) => setMessage(v)} dynamicValue={message} value={message} type="message" name="message" placeholder={translate("your_message")} />
                    <button disabled={submitting || !isConnected() || conversation == undefined} onClick={(e) => sendMessage()} className="btn btn-black">{translate("send")}</button>
                </div>
            </div>
        )
    }

    const [showConversation, setShowConversation] = useState<boolean>(true);

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content="" />
            </Head>

            <Navbar lang={lang} user={user} fixedTop={true} />
            
                {/* <div className="text-uppercase text-center text-gray d-flex justify-content-center align-items-center py-1 fw-bold px-4 bg-success small">
                            {translate("connected_to_server")}
                </div> */}
                
                {(connected == undefined && !isConnected()) &&
                (
                    <div className="text-uppercase text-center text-white d-flex justify-content-center align-items-center py-1 fw-bold px-4 bg-primary small">
                        <div className="spinner-border text-white me-2 " style={{ width: "1rem", height: "1rem" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        {translate("connection_to_server_in_progress")}
                    </div>
                )}
            {(connected != undefined && connected) &&
                (
                    <div className="text-uppercase text-center text-gray d-flex justify-content-center align-items-center py-1 fw-bold px-4 bg-success small">
                        {translate("connected_to_server")}
                    </div>
                )
            }
            {(connected != undefined && !connected) &&
                (
                    <div className="text-uppercase text-center text-gray d-flex justify-content-center align-items-center py-1 fw-bold px-4 bg-danger small">
                        {translate("disconnected_from_server")}
                    </div>
                )
            }
            <div className="flex-grow-1 row m-0 g-0 border-top">
                <div className={(showConversation ? "col" : "col-auto") + " col-md-5 col-xl-3"}>
                    <div className="bg-white h-100 border border-end-0 border-top-0 d-flex flex-column">
                        <div className="border-bottom d-flex" style={{ height: "3.5rem" }}>
                            {
                                showConversation && (
                                    <button className="col col-md-auto btn bg-trasnparent border-0 border-end ">
                                        <i className="fa-solid fa-magnifying-glass fs-2"></i>
                                    </button>
                                )
                            }
                            <div className="col-lg align-items-center d-none d-md-flex">
                                <h2 className="px-4 text-center fs-4 w-100 mb-0">{translate("conversations")}</h2>
                            </div>
                            <button onClick={(e) => setShowConversation((showConversation) => !showConversation)} className="col btn bg-trasnparent d-block d-md-none">
                                <i className="fa-sharp fa-solid fa-bars-staggered text-black fs-1"></i>
                            </button>
                        </div>
                        <div className={(!showConversation ? "d-none d-md-flex " : "") + "conversations flex-grow-1 gap-1 flex-column position-relative"}>

                            {
                                conversations.length == 0 ? (
                                    <>
                                        <ConversationsPlaceholder />
                                        <div className="position-absolute top-0 start-0 end-0 bottom-0 flex-grow-1 d-flex flex-column text-center text-muted">
                                            <div className="my-auto">
                                                <i className="fa-solid fa-user-group fs-1"></i>
                                                <h3 className="pt-3 fs-5 lh-sm mb-0">{translate("no_conversation_at_the_moment")}</h3>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    conversations.sort((a, b) => (b.has_messages - a.has_messages)).map((conversation) => {
                                        return Conversation(conversation);
                                    })
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className={(showConversation ? "d-none d-md-block" : "") + " col col-md-7 col-xl-6"}>
                    <div className="bg-white h-100 border border-end-0 border-top-0 d-flex flex-column">
                        <div className="border-bottom d-flex" style={{ height: "3.5rem" }}>
                            <div className="w-100 d-flex align-items-center">
                                <h2 className="text-center fs-4 w-100 mb-0">{conversation == undefined ? translate("conversation") : conversation.profile.firstname + " " + conversation.profile.lastname}</h2>
                            </div>
                        </div>
                        <div className="flex-grow-1 bg-light d-flex flex-column align-items-center justify-content-center">
                            {conversations.length == 0 ? (
                                <div className="px-5 text-center text-muted">
                                    <i className="fa-solid fa-comments fs-1"></i>
                                    <h1 className="fs-3 mt-4 mb-5">{translate("welcome_to_messaging")}</h1>
                                    <p className="lh-sm">
                                        {translate("welcome_to_messaging_explanation")}
                                    </p>
                                </div>
                            ) : (
                                ChatBox()
                            )}
                        </div>
                    </div>
                </div>
                <div className="d-none d-xl-block col-3">
                    <div className="bg-white h-100 border border-end-0 border-top-0 d-flex flex-column">
                        <div className="position-relative flex-grow-1 d-flex flex-column">
                            {
                                conversation == undefined ? (
                                    <>
                                        <ProfilePlaceholder />
                                        <div className="position-absolute top-0 start-0 end-0 bottom-0 flex-grow-1 d-flex flex-column text-center text-muted">
                                            <div className="my-auto">
                                                <i className="fa-solid fa-briefcase fs-1"></i>
                                                <h3 className="px-3 pt-3 fs-5 lh-sm mb-0">{translate("here_the_information_of_user")}</h3>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    ProfileInformation(conversation != undefined && conversation.profile)
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const jobs = (await JobsAPI.getJobs()).map((job: any) => job.name);
    const user = await ServerSide.getUser(context)
    const datas = await ServerSide.getServerSideProps(context, "chat", user);

    if (user == null)
        return {
            redirect: {
                destination: "/" + datas.lang + "/signin",
                permenant: false
            }
        }

    const { open } = context.query;

    
    if (open && open != user.profile.id) {
        return {
            props: {
                ...datas,
                jobs,
                target: open
            }
        };
    }

    if (open && open != user.profile.id) {
        const conversations = await Chat.getConversationsByProfilesId([user.profile.id, open]);
        if (conversations.length > 0) {
            return {
                props: {
                    ...datas,
                    jobs,
                    conversation: conversations[0].id
                }
            };
        } else {
            const target_profile = await ProfileHandler.getProfileById(open);
            if (target_profile != null) {
                const { id } = await Chat.createConversation([user.profile.id, open])
                return {
                    props: {
                        ...datas,
                        jobs,
                        conversation: id
                    }
                };
            }
        }
    }

    return {
        props: {
            ...datas,
            jobs
        }
    };
}

