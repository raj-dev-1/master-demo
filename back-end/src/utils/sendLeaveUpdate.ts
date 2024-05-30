import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { User } from "../models/user.model";
import { EMAIL_FROM, EMAIL_PASWORD } from "../config/constant";
import path from "path";

const sendLeaveUpdate = async (emailDetails: any) => {
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

    const filePath = path.join(__dirname,"../views/sendLeaveUpdate.hbs");
    const source = readFileSync(filePath, "utf-8");
    const template = Handlebars.compile(source);

    const { userId, startDate, endDate, leaveType, status } = emailDetails;

    const user: any = await User.findOne({ where: { id: userId } });

    if (!user) {
      return { valid: false, res: "User not found." };
    }

    const { email, name } = user;

    const htmlToSend = template({
      name,
      startDate,
      endDate,
      leaveType,
      status,
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: "Leave Status Update",
      text: "Hello Manager",
      html: htmlToSend,
    });

    return { valid: true, res: "Mail send successfully." };
  } catch (error) {
    console.log(error);
    return { valid: false, res: "Failed to send mail." };
  }
};

export { sendLeaveUpdate };
