import checkerUtils from '@/utils/checker.utils';
import config from "../../../../config.json"
import jwtUtils from '@/utils/jwt.utils';
import { UserBuilder } from '@/builders/UserBuilder';
import SessionHandler from '@/sides/server/SessionHandler';
import { MailHandler } from '@/handler/MailHandler';

const { User } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    if (req.method != "POST") return res.status(400).json({ message: "bad_request" });

    try {

        const { email, language } = req.body;

        if (await checkerUtils.missingParameters(email, language))
            return res.status(400).json({ message: 'missing_parameters' });

        const user = await User.findOne({ where: { email } });
        if (user == null)
            return res.status(401).json({ message: 'user_not_found' });

        const password_forget_token = jwtUtils.signSimpleToken(email);
        await user.update({ password_forget_token });

        MailHandler.sendMail(MailHandler.MailType.PASSWORD_FORGET, language, email, "[reset-password-link]", config.website + "/" + language + "/change-password?password_forget_token=" + password_forget_token)

        return res.status(202).json({ message: "password_forget_email_has_been_send" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
