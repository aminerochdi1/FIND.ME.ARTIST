import checkerUtils from '@/utils/checker.utils';
import config from "../../../config.json"
import jwtUtils from '@/utils/jwt.utils';
import { UserBuilder } from '@/builders/UserBuilder';

const bcrypt = require('bcrypt');

const { User, Session } = require('../../../../models');

export default async function handler(req: any, res: any) {
    try {
        if (req.method != "POST") {
          return res.status(400).json({ message: "bad_request" });
        }
        
        const { email, password } = req.body;

        if (await checkerUtils.missingParameters(email, password)) {
            return res.status(400).json({ message: 'missing_parameters' });
        }

        const user = await User.findOne({ where: { email }});
        const passwordValid = user != null ? (await bcrypt.compare(password, user.password)) : false;
        if (user != null && passwordValid) {
            const { token, expiration } = jwtUtils.signSession({ email: user.email, user_id: user.id });

            user.password = undefined;

            const session = await Session.create({
                user_id: user.id,
                token,
                expiration
            })

            return res.status(200).json({ user: await UserBuilder.build(user), session, message: 'login_successfully' });
        } else {
            return res.status(401).json({ message: 'identifier_incorrect' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal_server_error' });
    }
}
