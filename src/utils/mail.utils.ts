const nodemailer = require('nodemailer');
const fs = require('fs');

const configuration = require("../config.server.json");

const config = configuration.transporter;
const dkim = configuration.dkim;

const transporter = nodemailer.createTransport(config);
const path = require('path');

const readTemplate = async (lang: string, template: string) => {
    const mailsDirectory = path.join(process.cwd(), 'src/mails/');
    
    return new Promise((resolve, reject) => {
        fs.readFile(mailsDirectory + lang + "/" + template + ".html", 'utf-8', (err: any, data: any) => {
            if (err) {
                console.error('Error when try read the template :', err);
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

const sendTemplate = async (lang: string, template: string, mailOptions: any, ...replaces: string[]) => {
    let message: any = undefined;
    try {
        message = await readTemplate(lang, template);
    } catch (error) {
        console.error(error)
        return false;
    }

    if (replaces != undefined && replaces.length % 2 == 0) {
        for (let i = 0; i < replaces.length; i += 2) {
            message = message.replace(replaces[i], replaces[i + 1]);
        }
    }

    await send({
        html: message,
        ...mailOptions,
    });

    return true;
}

const send = async (mailOptions: any) => {
    const mailConfiguration = {
        from: config.name+" <"+config.auth.user+">",
        ...mailOptions,
        dkim
    };

    await transporter.sendMail(mailConfiguration);
}

export { send, sendTemplate };