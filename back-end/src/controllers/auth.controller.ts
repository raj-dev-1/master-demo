import { Request, Response } from "express";
import { checkUser, updateUserService } from "../services/user.service";
import { userMassage } from "../config/message";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { role, roleByName } from "../config/variables";
import { SECRET_KEY } from "../config/constant";
import { deleteFile, imgPath, User, validateData } from "../models/user.model";
import { sendMail } from "../utils/sendMail";
import { setLeave } from "../services/leave.service";
import {
  createOtpService,
  deleteExpiredOTP,
  generateOTP,
  getOtp,
} from "../services/otp.service";
import { sendOtpMail } from "../utils/sendOtpMail";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser: any = await checkUser(email);

    if (!findUser)
      return res.status(404).json({ message: userMassage.error.userNotFound });

    const isValidPassword = await bcrypt.compare(password, findUser.password);

    if (!isValidPassword)
      return res.status(400).json({ message: userMassage.error.wrongPassword });

    const { id, name, email: userEmail, phone, roleId } = findUser;
    const role = roleByName[roleId];
    const userDetails = {
      id,
      name,
      email: userEmail,
      phone,
      role,
    };

    const token = jwt.sign({ userDetails }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.cookie("jwt", token, { httpOnly: true });
    return res.status(200).json({
      message: userMassage.success.loginSuccess,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const register = async (req: Request | any, res: Response) => {
  try {
    const { error, value } = validateData(req.body);
    if (error) {
      if (req.file) await deleteFile(req.file);
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      name,
      email,
      password,
      confirmPassword,
      gender,
      grNumber,
      phone,
      address,
      department,
      div,
    } = value;

    if (confirmPassword !== password) {
      await deleteFile(req.file);
      return res
        .status(400)
        .json({ message: userMassage.error.passwordNotMatch });
    }

    const findUser = await checkUser(email);

    if (findUser) {
      await deleteFile(req.file);
      return res.status(400).json({ message: userMassage.error.invalidEmail });
    }

    let image = "";
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      image = baseUrl + imgPath + "/" + req.file.filename;
    }

    const newUser: any = {
      name,
      email,
      gender,
      image,
      grNumber,
      phone,
      address,
      department,
      div,
      password: await bcrypt.hash(password, 10),
      roleId: role.student,
    };

    const user: any = await User.create(newUser);

    if (!user)
      return res.status(400).json({ message: userMassage.error.signUpError });

    const setLeaveResult = await setLeave(user.id);

    let userError = "";
    if (!setLeaveResult) userError = userMassage.error.userLeave;

    const emailDetails = {
      name,
      email,
      password: req.body.password,
    };

    const sendEmail = await sendMail(emailDetails);
    if (!sendEmail.valid) userError += userMassage.error.mail;

    return res
      .status(201)
      .json({ message: userMassage.success.signUpSuccess, userError });
  } catch (error: any) {
    if (req.file) await deleteFile(req.file);
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: userMassage.success.logout });
  } catch (error) {
    return res.status(501).json({ message: userMassage.error.genericError });
  }
};

const forgetPassword = async (req: Request | any, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: userMassage.error.fillDetails });
    }

    const { email } = req.body;

    const findUser = await checkUser(email);

    if (!findUser) {
      return res.status(404).json({ message: userMassage.error.userNotFound });
    }

    const otp: number = generateOTP();
    // const otpDetails = { email, otp };

    const createOtp = await createOtpService({ email, otp });

    if (!createOtp) {
      return res.status(400).json({ message: userMassage.error.otp });
    }

    const sendOtpEmail = await sendOtpMail({ email, otp });

    if (sendOtpEmail.valid) {
      setTimeout(deleteExpiredOTP, 60 * 3000);
    }

    return res.status(201).json({ message: userMassage.success.otp });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: userMassage.error.otpTime });
    }
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

interface RequestBody {
  email: string;
  otp: string;
}

export interface Condition {
  where: {
    email: string;
  };
}

const verifyOtp = async (req: Request | any, res: Response) => {
  try {
    const { email, otp } = req.body as RequestBody;
    const conditon : Condition = { where: { email } }
    const findOtp: any = await getOtp(conditon);

    if (findOtp.otp == otp) {
      return res.status(200).json({ message: userMassage.success.otpVerify });
    }

    return res.status(400).json({ message: userMassage.error.otpVerify });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const resetPassword = async (req: Request | any, res: Response) => {
  try {
    const { email, password } = req.body;
    const conditon : Condition = { where: { email } }
    const updatePassword : any = {
      password: await bcrypt.hash(password, 10),
    };

    const updateDetails = await updateUserService(updatePassword,conditon);

    if (!updateDetails)
      return res.status(400).json({ message: userMassage.error.update });

    return res.status(200).json({ message: userMassage.success.update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

export { login, logout, register, forgetPassword, verifyOtp, resetPassword };
