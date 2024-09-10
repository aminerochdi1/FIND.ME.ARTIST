import { sendTemplate } from "../utils/mail.utils"

export class MailHandler {

    public static MailType: any = {
        REGISTER_CONFIRMATION: {
            template: "register-confirmation",
            subject: {
                fr: "Confirmation d'inscription - Find.me",
                en: "Registration Confirmation - Find.me"
            }
        },
        PASSWORD_FORGET: {
            template: "password-forget",
            subject: {
                fr: "Réinitialisation du mot de passe - Find.me",
                en: "Password Reset - Find.me"
            }
        },
        NEW_MESSAGE: {
            template: "new-message",
            subject: {
                fr: "Nouveau message reçu - Find.me",
                en: "New Message Received - Find.me"
            }
        },
        SUBSCRIPTION_SUCCESS: {
            template: "subscription-success",
            subject: {
                fr: "Confirmation d'achat - Find.me",
                en: "Purchase Confirmation - Find.me"
            }
        }
    }

    public static sendMail = async (type: any, lang: string, to: string, ...replaces: string[]) => {
        const subject = type.subject[lang] ?? type.subject["en"];
        return await sendTemplate(lang, type.template, { to, subject }, ...replaces)
    }
}