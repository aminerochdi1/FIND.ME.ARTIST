import { UserBuilder } from "@/builders/UserBuilder";
import SessionHandler from "@/sides/server/SessionHandler";
import checkerUtils from "@/utils/checker.utils";
// import config from "@/config.server.json";
// const stripe = require('stripe')(config.stripe_private_token);
import Discount from "@/sides/server/Discount";
import { MailHandler } from "@/handler/MailHandler";
const { User, Session } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    // if (req.method !== "POST") return res.status(400).json({ message: "invalid_request" })

    // try {
    //     const token = SessionHandler.getAuthorization(req);
    //     const { code, language, payment_id } = req.body;

    //     if (await checkerUtils.missingParameters(token, language, payment_id)) {
    //         return res.status(400).json({ message: "missing_parameters" });
    //     }

    //     const { success, user } = await SessionHandler.checkSession(token);

    //     if (success) {
    //         var discountcode = undefined;

    //         if (code != undefined) {
    //             discountcode = await Discount.getCode(code);
    //             if (discountcode == undefined)
    //                 return res.status(404).json({ message: 'discount_code_not_found' });
    //         }

    //         const profile = await user.getProfile();
    //         const hasSubscription = await profile.getSubscription() != undefined;

    //         if (!hasSubscription) {
    //             const discount_id = discountcode != undefined ? discountcode.id : undefined;
    //              const priceToPay = (config.price * (discountcode != undefined ? 1 - discountcode.reduction : 1));
    //              const amount = Math.round(100 * priceToPay);
    //              const subscription = await profile.subscribe(discount_id, priceToPay);
    //             if (!subscription)
    //                 return res.status(500).json({ message: 'subscription_failed' });

    //             try {
    //                 const charge = await stripe.charges.create({
    //                     amount,
    //                     currency: 'eur',
    //                     source: payment_id,
    //                     description: profile.id+" # "+profile.firstname + " - " + profile.lastname
    //                 });

    //                 MailHandler.sendMail(MailHandler.MailType.SUBSCRIPTION_SUCCESS, language, user.email);

    //                 return res.status(201).json({ message: 'subscription_success', subscription });
    //             } catch (err) {
    //                 subscription.destroy();
    //                 console.error(err)
    //                 return res.status(500).json({ message: 'subscription_failed' });
    //             }
    //         }
    //         return res.status(406).json({ message: 'you_are_already_subscribed' });
    //     }
    //     return res.status(401).json({ message: 'session_invalid' });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'internal_server_error' });
        
    // }
}
