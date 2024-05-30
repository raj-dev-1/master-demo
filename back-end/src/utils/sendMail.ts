import { readFileSync } from "fs";
import { EMAIL_FROM, EMAIL_PASWORD } from "../config/constant";
import nodemailer from 'nodemailer';
import Handlebars from "handlebars";
import path from "path";

const sendMail = async (emailDetails : any) => {
    try {
      const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: EMAIL_FROM,
          pass:  EMAIL_PASWORD,
        },
      });

      const filePath = path.join(__dirname,"../views/signupMail.hbs");
      const source = readFileSync(filePath, "utf-8");
      const template = Handlebars.compile(source);
  
      const { name, email, password } = emailDetails;
      const htmlToSend = template({ name, email, password });

      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: "Welcome To LMS",
        text: "Hello Manager ",
        html: htmlToSend,
      });

      return { valid: true, res: "Mail send successfully." };
      
    } catch (error) {
      console.log(error);
      return { valid: false, res: "Failed to send mail." };
    }
}

export { sendMail };
