import nodemailer from "nodemailer"
import Constants  from "../constants.js"

export const transporter = nodemailer.createTransport({
  host: Constants.HOST,
  port: Constants.EMAIL_PORT,
  secure: true, 
  auth: {
    user: Constants.USER,
    pass: Constants.PASS,
  },
});