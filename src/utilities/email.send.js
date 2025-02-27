import { transporter } from "../config/mail.config.js";
import Constants from "../constants.js";

export async function sendMail({email=[], subject="", htmlTemplate="" }) {
    const info = await transporter.sendMail({
      from: Constants.FROM, // sender address
      to: email.join(", "), // list of receivers
      subject: subject, // Subject line
      html: htmlTemplate, // html body
    });


    return info;

  }