import { Op } from "sequelize";
import Otp from "../models/Otp.model";
import { Condition } from "../controllers/auth.controller";

const generateOTP = (): any => {
  try {
    let digits = "0123456789";
    let OTP = "";
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  } catch (error) {
    console.log(error);
  }
};

const deleteExpiredOTP = async () => {
  try {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    await Otp.destroy({
      where: {
        createdAt: {
          [Op.lt]: threeMinutesAgo,
        },
      },
    });
    console.log("Expired OTPs deleted successfully.");
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};

type CreateOtpType = {
  email: string;
  otp: number;
};

const createOtpService = async (otpDetails: CreateOtpType) => {
  try {
    const result = await Otp.create(otpDetails);
    return result;
  } catch (error) {
    console.error("Error creating OTP:", error);
    return null;
  }
}
const getOtp = async (conditon:Condition) => {
  try {
    const result = await Otp.findOne(conditon);
    return result;
  } catch (error) {
    console.error("Error creating OTP:", error);
    return null;
  }
}

export { deleteExpiredOTP, generateOTP, createOtpService, getOtp };
