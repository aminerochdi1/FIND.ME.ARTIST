import checkerUtils from '@/utils/checker.utils';
import config from "../../../../config.json"
import { UserBuilder } from '@/builders/UserBuilder';
import SessionHandler from '@/sides/server/SessionHandler';

const bcrypt = require('bcrypt');

const { User } = require('../../../../../models');

export default async function handler(req: any, res: any) {
    try {
        if (req.method != "POST") {
            return res.status(400).json({ message: "bad_request" });
        }

        const token = SessionHandler.getAuthorization(req);
        const { password_forget_token, password } = req.body;

        if (await checkerUtils.missingParameters(password))
            return res.status(400).json({ message: 'missing_parameters' });

        const errors = await checkerUtils.errors({ password });
        if (errors.length > 0)
            return res.status(400).json({ message: "an_error_occurred", errors });

        const passwordHashed = bcrypt.hashSync(password, config.BCRYPT_SALT)

        if (token) {
            const { success, message, user } = await SessionHandler.checkSession(token);
            if (success) {
                if (user == null)
                    return res.status(401).json({ message: 'user_not_found' });

                await user.update({ password: passwordHashed })
                return res.status(202).json({ message: 'password_changed' });
            }
            return res.status(401).json({ message });
        } else if (password_forget_token) {
            const user = await User.findOne({ where: { password_forget_token } });
            if (user == null)
                return res.status(401).json({ message: 'user_not_found' });

            await user.update({ password_forget_token: null, password: passwordHashed })
            return res.status(202).json({ message: 'password_changed' });
        } else {
            return res.status(400).json({ message: 'missing_parameters' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
