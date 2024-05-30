import { userMassage } from "../config/message";
import { unlinkSync } from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { User, validateData, imgPath } from "../models/user.model";
import { checkUser } from "../services/user.service";
import { role, leaveDetails, roleByName } from "../config/variables";
import { SECRET_KEY } from "../config/constant";
import { LeaveRequest } from "../models/leaveRequest.model";
import validateDates from "../utils/validateDates";
import { UserLeave } from "../models/userLeave.model";
import { Request, Response } from "express";
import { sendMail } from "../utils/sendMail";
import Otp from "../models/Otp.model";
import { sendOtpMail } from "../utils/sendOtpMail";
import { Op } from "sequelize";

const deleteFile = async (file: { path?: string }) => {
  try {
    if (file && file.path) {
      await unlinkSync(file.path);
    }
  } catch (error) {
    console.log(error);
  }
};
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
const setLeave = async (userId: any) => {
  try {
    const studentLeave: any = {
      userId,
      ...leaveDetails.student,
    };

    const createUserLeave = await UserLeave.create(studentLeave);
    return !createUserLeave ? { valid: true } : true;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
};

const register = async (req: Request | any, res: Response) => {
  try {
    // if (!req.body && !req.file)
    //   return res.status(400).json({ message: userMassage.error.fillDetails });

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

    const user : any = await User.create(newUser);

    if (!user)
      return res.status(400).json({ message: userMassage.error.signUpError });

    // const getUserId =  user.id;
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

    const otp = generateOTP();
    // const otpDetails = { email, otp };

    const createOtp = await Otp.create({ email, otp });
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
      expiresIn: "1h",
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

const profile = async (req: Request | any, res: Response) => {
  try {
    const { roleId, ...userInfo } = req.user.dataValues;
    const userDetails = { ...userInfo, user: roleByName[roleId] };

    return res.status(201).json({
      message: userMassage.success.profileRetrieved,
      profile: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: userMassage.error.genericError });
  }
};

const leaveStatus = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const leaveStatus = await LeaveRequest.findAll({
      where: { userId },
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "requestedTo",
          attributes: ["name", "email"],
        },
      ],
    });

    return res
      .status(200)
      .json({ leaveStatus, message: userMassage.success.leaveStatus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const applyLeave = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const { roleId } = req.user;
    const checkLeave = await LeaveRequest.findAndCountAll({
      where: { userId, status: "Pending" },
    });

    if (checkLeave.count <= 2) {
      const { startDate, endDate, leaveType, reason } = req.body;
      const requestToId = req.body?.requestToId || 3;
      const dates = {
        startDate,
        endDate,
      };
      const checkDates = await validateDates(dates);
      if (!checkDates.valid) {
        return res.status(400).json({ message: checkDates.message });
      }
      const leaveDetails: any = {
        userId,
        startDate,
        endDate,
        leaveType,
        reason,
        requestToId,
        roleId,
      };

      const createLeave = await LeaveRequest.create(leaveDetails);

      if (!createLeave)
        return res
          .status(400)
          .json({ message: userMassage.error.leaveRequest });

      return res
        .status(201)
        .json({ message: userMassage.success.leaveRequest });
    }
    return res
      .status(401)
      .json({ message: userMassage.error.leaveRequestLimit });
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const leaveBalance = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const leaveBalance = await UserLeave.findOne({
      where: { userId },
      attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    });

    return res
      .status(200)
      .json({ leaveBalance, message: userMassage.success.leaveBalance });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const verifyOtp = async (req: Request | any, res: Response) => {
  try {
    const { email, otp } = req.body;

    const findOtp: any = await Otp.findOne({ where: { email } });

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

    const updatePassword = {
      password: await bcrypt.hash(password, 10),
    };

    const updateDetails = await User.update(updatePassword, {
      where: { email },
    });

    if (!updateDetails)
      return res.status(400).json({ message: userMassage.error.update });

    return res.status(200).json({ message: userMassage.success.update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
}

const editUser = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const userImage = req.user.image;
    const userEmail = req.user.email;

    if (userEmail !== req.body.email && req.body.email) {
      const findUser = await checkUser(req.body.email);
      if (findUser) {
        await deleteFile(req.file);
        return res.status(400).json({
          message: userMassage.error.invalidEmail,
        });
      }
    }

    if (req.file) {
      const parsedUrl = new URL(userImage);
      const imagePath = parsedUrl.pathname;
      const fullPath = path.join(__dirname, "..", imagePath);
      await unlinkSync(fullPath);

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      req.body.image = baseUrl + imgPath + "/" + req.file.filename;
    }

    const { name, email, gender, grNumber, phone, address, image, div } =
      req.body;

    const updatedUser = {
      name,
      email,
      gender,
      image,
      grNumber,
      phone,
      address,
      div,
    };

    const [editCount] = await User.update(updatedUser, {
      where: { id: userId },
    });

    if (editCount === 0)
      return res.status(400).json({
        message: userMassage.error.update,
      });

    return res.status(200).json({
      message: userMassage.success.update,
    });
  } catch (error: any) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
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

export {
  login,
  register,
  setLeave,
  profile,
  leaveStatus,
  applyLeave,
  leaveBalance,
  editUser,
  logout,
  deleteFile,
  verifyOtp,
  forgetPassword,
  resetPassword
};
