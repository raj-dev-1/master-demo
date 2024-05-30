import { readFileSync } from "fs";
import nodemailer from 'nodemailer';
import Handlebars from "handlebars";
import { EMAIL_FROM, EMAIL_PASWORD } from "../config/constant";
import path from "path";

const sendOtpMail = async (otpDetails: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASWORD,
      },
    });

    const filePath = path.join(__dirname,"../views/forgetOtp.hbs");
    
    const source = readFileSync(filePath, "utf-8");
    const template = Handlebars.compile(source);

    const { email, otp } = otpDetails;
    const htmlToSend = template({ email, otp });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: "Forget password",
      text: "Hello User ",
      html: htmlToSend,
    });
    return { valid: true, res: "Mail send successfully." };
  } catch (error) {
    console.log(error);
    return { valid: false, res: "Failed to send mail." };
  }
};

export  {sendOtpMail};
