import checkerUtils from '@/utils/checker.utils';
import config from "../../../config.json"
import { RoleType } from '@/classes/RoleType';
import jwtUtils from '@/utils/jwt.utils';
import { MailHandler } from '@/handler/MailHandler';

const bcrypt = require('bcrypt');
const { User, Profile } = require('../../../../models');

const { ARTIST, RECRUITER } = RoleType;

export default async function handler(req: any, res: any) {
  try {
    if (req.method != "POST") {
      return res.status(400).json({ message: "bad_request" });
    }

    if (await checkerUtils.missingParameters(req.body.role)) {
      return res.status(400).json({ message: 'missing_parameters' });
    }

    const { role, language, firstname, lastname, company_name, email, born_date, gender, country, city, password, jobs } = req.body;
    if (!(role == ARTIST || role == RECRUITER)) {
      return res.status(400).json({ message: 'role_incorrect' });
    }

    const missingParamaters = [language, firstname, lastname, email, born_date, gender, country, city, password];
    /*
    if (role == ARTIST) {
      company_name = "";
      missingParamaters = [...missingParamaters, firstname, lastname];
    }
    if (role == RECRUITER) {
      firstname = "";
      lastname = "";
      missingParamaters = [...missingParamaters, company_name];
    }*/

    if (await checkerUtils.missingParameters(missingParamaters)) {
      return res.status(400).json({ message: 'missing_parameters' });
    }

    if (role == ARTIST && await checkerUtils.missingParameters(jobs)) {
      return res.status(400).json({ message: 'missing_parameters' });
    }

    const errors = await checkerUtils.errors({ firstname, lastname, email, password });
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors, message: "an_error_occurred_during_registration" });
    }

    const bornDate = new Date(born_date);
    if (isNaN(bornDate.getTime())) {
      return res.status(400).json({ errors: [{ "date_born": "date_invalid" }], message: "an_error_occurred_during_registration" })
    }

    if (await User.findOne({ where: { email } })) {
      res.status(500).json({ message: 'email_already_used' });
      return;
    }

    const profile: any = {
      role,
      firstname,
      lastname,
      gender,
      bornDate,
      country,
      city
    }

    Profile.create(profile)
      .then((instance: any) => {
        const profile_id = instance.id;
        try {
          if (role == ARTIST) {
            jobs.map((job: string) => {
              const job_id = parseInt(job);
              if (!isNaN(job_id)) {
                instance.addJob(job_id)
              }
            })
          }

          const passwordHashed = bcrypt.hashSync(password, config.BCRYPT_SALT)
          const confirmationToken = jwtUtils.signSimpleToken(email);

          const user: any = {
            profile_id,
            email,
            password: passwordHashed,
            confirmation_token: confirmationToken
            /* 
              /!\ Temporairement retirer afin de pouvoir vérifier la création de compte /!\
              */
          }

          if (user.confirmation_token) {
            MailHandler.sendMail(MailHandler.MailType.REGISTER_CONFIRMATION, language, email, "[confirm-link]", config.website + language + "/confirm?confirmation_token=" + user.confirmation_token)
          }

          User.create(user)
            .then((instance: any) => {
              res.status(200).json({ message: 'account_created_successfully' });
            }).catch((err: any) => {
              console.error(err);
              res.status(500).json({ message: 'internal_server_error' });
            })
        } catch (error) {
          console.error(error);
          Profile.destroy({ where: { id: profile_id } });
        }
      }).catch((err: any) => {
        console.error(err);
        res.status(500).json({ message: 'internal_server_error' });
      })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal_server_error' });
  }
}
