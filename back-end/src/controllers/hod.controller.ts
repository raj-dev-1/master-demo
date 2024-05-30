import { Request, Response } from "express";
import { userMassage } from "../config/message";
import { imgPath, User, validateData } from "../models/user.model";
import bcrypt from "bcryptjs";
import { checkUser, findUserId } from "../services/user.service";
import { leaveDetails, role } from "../config/variables";
import { UserLeave } from "../models/userLeave.model";
import { deleteFile } from "./user.controller";
import path from "path";
import { unlinkSync } from "fs";
import { sendMail } from "../utils/sendMail";

const setLeaveFaculty = async (userId: any) => {
  try {
    const studentLeave: any = {
      userId,
      ...leaveDetails.faculty,
    };

    const createFacultyLeave = await UserLeave.create(studentLeave);
    return !createFacultyLeave ? { valid: true } : true;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
};

const registerFaculty = async (req: Request | any, res: Response) => {
  try {
    if (!req.body && !req.file)
      return res.status(400).json({ message: userMassage.error.fillDetails });

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
      roleId: role.faculty,
    };

    const user = await User.create(newUser);

    if (!user)
      return res.status(400).json({ message: userMassage.error.signUpError });

    const getUserId = await findUserId(email);
    const setLeaveResult = await setLeaveFaculty(getUserId);
    
    let userError = "";
    if (!setLeaveResult) userError = userMassage.error.userLeave;

    const emailDetails = {
      name,
      email,
      password: req.body.password,
    };

    const sendEmail = await sendMail(emailDetails);
    if (!sendEmail.valid) userError += userMassage.error.mail;

    return res.status(201).json({ message: userMassage.success.signUpSuccess, userError });
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

const editFaculty = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const facultyDetails: any = await User.findByPk(id);

    if (!facultyDetails) {
      return res.status(400).json({
        message: userMassage.error.invalidEmail,
      });
    }

    const { image, email } = facultyDetails;

    if (facultyDetails.roleId !== role.faculty) {
      return res.status(400).json({
        message: userMassage.error.facultyUpdateRole,
      });
    }

    if (email !== req.body.email) {
      const findUser = await checkUser(req.body.email);

      if (findUser) {
        if (req.file) await deleteFile(req.file);
        return res.status(400).json({
          message: userMassage.error.invalidEmail,
        });
      }
    }

    if (req.file) {
      const parsedUrl = new URL(image);
      const imagePath = parsedUrl.pathname;
      const fullPath = path.join(__dirname, "..", imagePath);

      await unlinkSync(fullPath);
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      req.body.image = baseUrl + "/imgPath/" + req.file.filename;
    }

    const editUser = await User.update(req.body, {
      where: { id },
    });

    if (!editUser[0]) {
      return res.status(400).json({
        message: userMassage.error.update,
      });
    }

    return res.status(200).json({
      message: userMassage.success.update,
    });
  } catch (error:any) {
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    return res
      .status(500)
      .json({ message: userMassage.error.genericError });
  }
};

export { registerFaculty, editFaculty };
