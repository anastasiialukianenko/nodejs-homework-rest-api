import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  }
}

const transport = nodemailer.createTransport(nodemailerConfig);


// const sendEmail = (data) => {
//     const email = { ...data, from: UKR_NET_EMAIL };
//     return transport.sendMail(email)
// }

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return new Promise((resolve, reject) => {
    transport.sendMail(email, (error, info) => {
      if (error) {
        console.error("Error occurred while sending email:", error);
        reject(error);
      } else {
        console.log("Email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
};

export default sendEmail;