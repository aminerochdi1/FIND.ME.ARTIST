import config from "../config.server.json";
const jwt = require('jsonwebtoken');

const jwtUtils = {
    SECRET_KEY: config.jwt.secretKey,
    verifySession: (token: string) => {
        try {
            const session = jwt.verify(token, config.jwt.secretKey);

            return session;
        } catch (err) {
            return false;
        }
    },
    signSimpleToken: (payload: any) => {
        const token = jwt.sign(payload, config.jwt.secretKey);

        return token;
    },
    signSession: (payload: any) => {
        const duration = config.session.expireIn;
        const token = jwt.sign(payload, config.jwt.secretKey, { expiresIn: duration });

        const durationType = duration[duration.length - 1];
        let durationValue = parseInt(duration, 10);

        if (isNaN(durationValue)) {
            throw new Error('Invalid duration format');
        }

        switch (durationType) {
            case 's':
                durationValue *= 1000;
            case 'm':
                durationValue *= 60 * 1000;
            case 'h':
                durationValue *= 60 * 60 * 1000;
            case 'd':
                durationValue *= 24 * 60 * 60 * 1000;
        }

        const now = new Date();
        return { token, expiration: new Date(now.getTime() + durationValue) };
    }
}

export default jwtUtils;
