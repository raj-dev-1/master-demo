import { readFileSync } from "fs";
import { EMAIL_FROM, EMAIL_PASWORD } from "../config/constant";
import { userMassage } from "../config/message";
import { LeaveRequest } from "../models/leaveRequest.model";
import { User } from "../models/user.model";
import nodemailer from 'nodemailer';
import Handlebars from "handlebars";
import { roleByName } from "../config/variables";
import cron from "node-cron";

const getPendingLeave = async () => {
  try {
    const pendingLeave = await LeaveRequest.findAll({
      where: {
        status: "pending",
      },
    });
    return pendingLeave;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
};

const findUser = async (requestToId:number) => {
  try {
    const userDetails = await User.findOne({
      where:{ id:requestToId },
      attributes: {
        exclude: ['password'],
      }
    });
    return userDetails;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
}

const sendReminderEmail = async (PendingLeaves: any) => {
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

    const source = readFileSync('views/leaveMail.hbs',"utf-8");
    const template = Handlebars.compile(source);

    for(const leave of PendingLeaves){
      const requestedBy : any = await User.findOne({ where:{ id: leave.userId }});
      const userDetail : any = await findUser(leave.requestToId);

      const emailTemp = template({
        name: userDetail.name,
        requestedByName: requestedBy.userName,
        requestedById: requestedBy.userId,
        requestedBy: roleByName[requestedBy.roleId],
        leaveId: leave.id,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
      })

      await transporter.sendMail({
        from: EMAIL_FROM,
        to: userDetail.email,
        subject: "Leave Request",
        text:"Hello Manager",
        html: emailTemp,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("0 17 * * *", async () => {
  try {
    const PendingLeaves = await getPendingLeave();
    await sendReminderEmail(PendingLeaves);
  } catch (error) {
    console.log(error);
  }
});

cron.schedule("0 9 * * *", async () => {
  try {
    const PendingLeaves = await getPendingLeave();
    await sendReminderEmail(PendingLeaves);
  } catch (error) {
    console.log(error);
  }
});


