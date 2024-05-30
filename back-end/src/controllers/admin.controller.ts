import { Request, Response } from "express";
import { imgPath, User, validateData } from "../models/user.model";
import path from "path";
import { unlinkSync } from "fs";
import { userMassage } from "../config/message";
import { leaveDetails, pagination, role } from "../config/variables";
import { UserLeave } from "../models/userLeave.model";
import { deleteFile } from "./user.controller";
import { checkUser, findUserId } from "../services/user.service";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/sendMail";

const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteImage: any = await User.findByPk(id);
    // if (!deleteImage)
    //     return res.status(400).json({
    //       message: userMassage.error.invalidEmail,
    //     });
    const { image } = deleteImage;
    const parsedUrl = new URL(image);
    const imagePath = parsedUrl.pathname;
    const fullPath = path.join(__dirname, "..", imagePath);

    try {
      await unlinkSync(fullPath);
    } catch (error: any) {
      console.log(error);
    }

    const removeUser = await User.destroy({ where: { id } });
    if (!removeUser)
      return res.status(400).json({ message: userMassage.error.delete });
    return res.status(200).json({
      message: userMassage.success.delete,
      removeUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const leaveReport = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const pageCount: any = page || pagination.pageCount;
    const limitDoc: any = limit || pagination.limitDoc;
    const totalLeave: any = await UserLeave.count({});
    const maxPage: any =
      totalLeave <= limitDoc ? 1 : Math.ceil(totalLeave / limitDoc);
    if (pageCount > maxPage)
      return res
        .status(404)
        .json({ message: `There are only ${maxPage} page` });
    const skip = (pageCount - 1) * limitDoc;
    const leaveReport = await UserLeave.findAll({
      attributes: {
        exclude: ["id", "academicYear", "createdAt", "updatedAt"],
      },
      order: [["usedLeave", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name", "email", "roleId"],
        },
      ],
      offset: skip,
      limit: limitDoc,
    });
    return res
      .status(200)
      .json({ leaveReport, message: userMassage.success.studentList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const registerHod = async (req: Request, res: Response) => {
  try {
    if (!req.body && !req.file && req.file == undefined)
      return res.status(400).json({ message: userMassage.error.fillDetails });

    const { error, value } = validateData(req.body);

    if (error) {
      if (req.file) await unlinkSync(req.file.path);
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      name,
      email,
      password,
      confirmPassword,
      gender,
      gr_number,
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
      return res.status(400).json({
        message: userMassage.error.invalidEmail,
      });
    }

    let image: "";
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      image = baseUrl + imgPath + "/" + req.file.filename;
    }

    const userData = {
      name,
      email,
      gender,
      image,
      gr_number,
      phone,
      address,
      department,
      div,
      password: await bcrypt.hash(password, 10),
      roleId: role.hod,
    };

    const user = await User.create(userData);
    if (!user)
      return res.status(400).json({ message: userMassage.error.signUpError });
    const getUserId = await findUserId(email);
    const setLeave = await setLeaveHod(getUserId);
    let userError = "";
    if (!setLeave) userError = userMassage.error.userLeave;
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
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const editHod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hodDetails: any = await User.findByPk(id);
    const { image, email } = hodDetails;

    if (hodDetails.roleId != role.hod)
      return res.status(400).json({
        message: userMassage.error.hodUpdateRole,
      });

    if (email != req.body.email) {
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
      req.body.image = baseUrl + imgPath + "/" + req.file.filename;
    }

    const editUser = await User.update(req.body, {
      where: { id },
    });

    if (!editUser)
      return res.status(400).json({
        message: userMassage.error.update,
      });

    return res.status(200).json({
      message: userMassage.success.update,
    });
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const setLeaveHod = async (userId: any) => {
  try {
    const studentLeave: any = {
      userId,
      ...leaveDetails.hod,
    };
    const createUserLeave = await UserLeave.create(studentLeave);
    return !createUserLeave ? { valid: true } : true;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
};

export { removeUser, leaveReport, registerHod, editHod };
