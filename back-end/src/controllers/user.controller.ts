import { userMassage } from "../config/message";
import { unlinkSync } from "fs";
import path from "path";
import { User, imgPath, deleteFile, validateData } from "../models/user.model";
import { checkUser, findUserId } from "../services/user.service";
import { role, roleByName } from "../config/variables";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { setLeaveFaculty, setLeaveHod } from "../services/leave.service";
import { sendMail } from "../utils/sendMail";
import { getPaginationParams, getSearchResults } from "../utils/pagination";

interface PageQuery {
  page?: string;
  search?: string;
  limit?: string;
}

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

    const { name, email, gender, grNumber, phone, address, image, div } = req.body;
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
    const updatedUserData : any= await User.findByPk(userId);
    let userRole : any = roleByName[updatedUserData.roleId];
    updatedUserData.dataValues.user = userRole;
  

    return res.status(200).json({
      message: userMassage.success.update,
      user: updatedUserData,
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

const facultyList = async (req: Request | any, res: Response) => {
  try {
    const { page, search, limit }: PageQuery = req.query;
    console.log("Received limit:", limit);

    const roleId = role.faculty;
    const whereCondition = { roleId };

    if (search && search.trim()) {
      const searchResults = await getSearchResults(User, ['name','address'], whereCondition, { search });
      return res.status(200).json({
        message: userMassage.success.studentList,
        searchResults,
      });
    }

    const { skip, limit: limitDoc, pageCount, maxPage } = await getPaginationParams(User, whereCondition, { page, limit });

    if (pageCount > maxPage) {
      return res.status(400).json({ message: `There are only ${maxPage} pages` });
    }

    const facultyList = await User.findAll({
      where: { roleId },
      offset: skip,
      limit: limitDoc,
    });

    return res.status(200).json({
      message: userMassage.success.studentList,
      facultyList,
    });
  } catch (error) {
    console.error(error);
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
  } catch (error : any) {
    if (error.name === "SequelizeValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ errors });
    }
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const hodList = async (req: Request | any, res: Response) => {
  try {
    const { page, search, limit }: PageQuery = req.query;
    const roleId = role.hod;
    const whereCondition = { roleId };
    if (search && search.trim()) {
      const searchResults = await getSearchResults(User, ['name','address'], whereCondition, { search });
      return res.status(200).json({
        message: userMassage.success.studentList,
        searchResults,
      });
    }

    const { skip, limit: limitDoc, pageCount, maxPage } = await getPaginationParams(User,whereCondition, { page, limit });

    if (pageCount > maxPage) {
      return res.status(400).json({ message: `There are only ${maxPage} pages` });
    }

    const hodList = await User.findAll({
      where: { roleId },
      offset: skip,
      limit: limitDoc,
    });

    return res.status(200).json({
      message: userMassage.success.studentList,
      hodList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const studentList = async (req: Request | any, res: Response) => {
  try {
    const { page, search, limit }: PageQuery = req.query;
    const roleId = role.student;
    const whereCondition = { roleId };
    if (search && search.trim()) {
      const searchResults = await getSearchResults(User, ['name','address'], whereCondition, { search });
      return res.status(200).json({
        message: userMassage.success.studentList,
        searchResults,
      });
    }

    const { skip, limit: limitDoc, pageCount, maxPage } = await getPaginationParams(User, whereCondition, { page, limit });

    if (pageCount > maxPage) {
      return res.status(400).json({ message: `There are only ${maxPage} pages` });
    }

    const studentList = await User.findAll({
      where: { roleId },
      offset: skip,
      limit: limitDoc,
    });

    return res.status(200).json({
      message: userMassage.success.studentList,
      studentList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const editStudent = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const studentDetails: any = await User.findByPk(id);
    const { image, email } = studentDetails;
    if (studentDetails.roleId != role.student)
      return res.status(400).json({
        message: userMassage.error.studentUpdateRole,
      });
    if (req.body.email) {
      if (email != req.body.email) {
        const findUser = await checkUser(req.body.email);

        if (findUser) {
          if (req.file) await deleteFile(req.file);
          return res.status(400).json({
            message: userMassage.error.invalidEmail,
          });
        }
      }
    }

    if (req.file) {
      const parsedUrl = new URL(image);
      const imgPath = parsedUrl.pathname;
      const fullPath = path.join(__dirname, "..", imgPath);
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

const registerFaculty = async (req: Request | any, res: Response) => {
  try {
    if (!req.body && !req.file)
      return res.status(400).json({ message: userMassage.error.fillDetails });

    const { error, value } = validateData(req.body);
// 
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

export {
  profile,
  editUser,
  removeUser,
  registerHod,
  editHod,
  facultyList,
  hodList,
  studentList,
  editStudent,
  registerFaculty,
  editFaculty
};
