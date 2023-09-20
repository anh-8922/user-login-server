import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function main(token, type = "registration") {
  // send mail with defined transport object

  let email = {};

  switch (type) {
    case "registration":
      email = {
        from: '"Fred Foo 👻" <developer@alkas.gr>', // sender address
        to: "test@alkas.gr", // list of receivers
        subject: "Hello ✔ welcome to our Social APP", // Subject line
        text: "Hello world! This is the plain text part", // plain text body
        html: `<b>Welcome to our social app</b>
        <p>click <a href="http://localhost:3000/emailconfirm/${token}">here</a> to verify your email</p>
      `, // html body
      };

      break;
    case "forgotPass":
      email = {
        from: '"Fred Foo 👻" <developer@alkas.gr>', // sender address
        to: "test@alkas.gr", // list of receivers
        subject: "Hello ✔ Instructions for changing your password", // Subject line
        text: "Hello world! Instructions for changing your password", // plain text body
        html: `<b>Follow the following instructions:</b>
        <p>click <a href="http://localhost:3000/changepass/${token}">here</a> to change your password</p>
      `, // html body
      };

      break;
    default:
      return null;
  }

  const info = await transporter.sendMail(email);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}
