import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 456,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  }
}

const transport = nodemailer.createTransport(nodemailerConfig);
// const data = {
//   to: "dejin72919@wanbeiz.com",
//   subject: "test email",
//   html: "<strong>Test email</strong>"
// }

// transport.sendMail(email).then(()=> console.log('Email send sucsess')).catch(error => console.log(error.message))

const sendEmail = (data) => {
    const email = { ...data, from: UKR_NET_EMAIL };
    return transport.sendMail(email)
}

export default sendEmail;