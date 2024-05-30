import { Request, Response } from "express";
import { userMassage } from "../config/message";
import { pagination, role } from "../config/variables";
import { imgPath, User } from "../models/user.model";
import { Op, Sequelize } from "sequelize";
import { LeaveRequest } from "../models/leaveRequest.model";
import { UserLeave } from "../models/userLeave.model";
import moment from "moment";
import { checkUser } from "../services/user.service";
import { deleteFile } from "./user.controller";
import path from "path";
import { unlinkSync } from "fs";
import { sendLeaveUpdate } from "../utils/sendLeaveUpdate";

interface pageQuery {
  page?: number;
  search?: string;
  limit?: number;
}

const studentList = async (req: Request | any, res: Response) => {
  try {
    const { page, search, limit }: pageQuery = req.query;
    const roleId = role.student;
    if (search && search.trim()) {
      const searchResults = await User.findAll({
        where: {
          roleId,
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      return res.status(200).json({
        message: userMassage.success.studentList,
        searchResults,
      });
    }
    const pageCount = page || pagination.pageCount;
    const limitDoc: any = limit || pagination.limitDoc;
    const totalUser = await User.count({ where: { roleId } });
    const maxPage = totalUser <= limitDoc ? 1 : Math.ceil(totalUser / limitDoc);

    if (pageCount > maxPage)
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page` });

    const skip = (pageCount - 1) * limitDoc;

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
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const hodList = async (req: Request | any, res: Response) => {
  try {
    const { page, search, limit }: pageQuery = req.query;
    const roleId = role.hod;
    if (search && search.trim()) {
      const searchResults = await User.findAll({
        where: {
          roleId,
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });
      return res.status(200).json({
        message: userMassage.success.studentList,
        searchResults,
      });
    }
    const pageCount = page || pagination.pageCount;
    const limitDoc: any = limit || pagination.limitDoc;
    const totalUser = await User.count({ where: { roleId } });
    const maxPage = totalUser <= limitDoc ? 1 : Math.ceil(totalUser / limitDoc);

    if (pageCount > maxPage) {
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page` });
    }

    const skip = (pageCount - 1) * limitDoc;
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
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const facultyList = async (req: Request | any, res: Response) => {
  try {
    const { page, search, limit }: pageQuery = req.query;
    const roleId = role.faculty;
    if (search && search.trim()) {
      const searchResults = await User.findAll({
        where: {
          roleId,
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });
      return res.status(200).json({
        message: userMassage.success.studentList,
        searchResults,
      });
    }
    const pageCount = page || pagination.pageCount;
    const limitDoc = limit || pagination.limitDoc;
    const totalUser = await User.count({ where: { roleId } });
    const maxPage = totalUser <= limitDoc ? 1 : Math.ceil(totalUser / limitDoc);
    if (pageCount > maxPage) {
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page` });
    }
    const skip = (pageCount - 1) * limitDoc;
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
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const leaveStatus = async (req: Request | any, res: Response) => {
  try {
    const requestToId = req.user.id;
    const leaveStatus = await LeaveRequest.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`DATEDIFF(endDate, startDate) + 1`),
            "leaveDifference",
          ],
        ],
      },
      where: { requestToId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserLeave,
          attributes: ["usedLeave", "availableLeave"],
        },
        {
          model: User,
          as: "requestedBy",
          attributes: ["id", "name", "email", "div", "roleId"],
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

const leaveApproval = async (req: Request | any, res: Response) => {
  try {
    const id = req.params.id;
    const statusData = req.body.status;
    const loginUser = req.user.id;
    const checkLeaveStatus: any = await LeaveRequest.findOne({ where: { id } });
    const { status, requestToId, startDate, leaveType, endDate, userId } =
      checkLeaveStatus;
    if (requestToId != loginUser)
      return res.status(400).json({
        message: userMassage.error.leaveStatusError,
      });

    if (status != "Pending")
      return res.status(400).json({ message: userMassage.error.leaveStatus });

    const LeaveApproval = await LeaveRequest.update(
      { status: statusData },
      { where: { id }, returning: true }
    );
    console.log(leaveType);

    if (statusData == "Approved") {
      if (!LeaveApproval)
        return res
          .status(400)
          .json({ message: userMassage.error.leaveApproval });
      const start = moment(startDate, "YYYY-MM-DD");
      const end = moment(endDate, "YYYY-MM-DD");
      let leaveDays: number;
      if (leaveType == "First half" || leaveType == "Second half") {
        leaveDays = start.isSame(end, "day")
          ? 0.5
          : end.diff(start, "days") / 2;
      } else {
        leaveDays = start.isSame(end, "day")
          ? 0.5
          : end.diff(start, "days") + 1;
      }
      const leaveData: any = await UserLeave.findOne({ where: { userId } });
      const availableLeave = leaveData.availableLeave - leaveDays;
      const usedLeave = Number(leaveData.usedLeave) + Number(leaveDays);
      const remainingDays = leaveData.totalWorkingDays - usedLeave;
      const attendancePercentage = (
        (remainingDays * 100) /
        leaveData.totalWorkingDays
      ).toFixed(2);

      const updateLeaveDetails: any = {
        availableLeave,
        usedLeave,
        attendancePercentage,
      };
      const updateLeave = await UserLeave.update(updateLeaveDetails, {
        where: { userId },
      });

      let userError = "";

      if (!updateLeave) userError += userMassage.error.userLeaveRec;

      const emailDetails = {
        userId,
        startDate,
        endDate,
        leaveType,
        status: "Approved",
      };

      const sendMail = await sendLeaveUpdate(emailDetails);
      if (!sendMail.valid) userError += userMassage.error.mail;

      return res.status(200).json({
        message: userMassage.success.leaveApproval,
        userError,
      });
    } else {
      if (!LeaveApproval)
        return res.status(400).json({ message: userMassage.error.leaveReject });
      const emailDetails = {
        userId,
        startDate,
        endDate,
        leaveType,
        status: "Rejected",
      };

      const sendMail : any = await sendLeaveUpdate(emailDetails);
      if (sendMail.valid)
        return res
          .status(201)
          .json({ message: userMassage.success.leaveUpdate });

      return res.status(200).json({
        message: userMassage.success.leaveReject,
        update: userMassage.success.leaveUpdateWithOutEmail,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const allLeaveStatus = async (req: Request | any, res: Response) => {
  try {
    const { search, userRole, limit, status, page } = req.query;

    let whereCondition: any = {};
    if (search && search.trim()) {
      whereCondition.status = {
        [Op.like]: `${search}%`,
      };
    }
    let findRole: any;
    if (userRole) {
      findRole = role[userRole];
      whereCondition.roleId = findRole;
    }
    if (status) {
      whereCondition.status = {
        [Op.like]: `${status}%`,
      };
    }

    const PageCount = page || pagination.pageCount;
    const limitDoc = limit || pagination.limitDoc;
    const totalLeave = await LeaveRequest.count({ where: whereCondition });
    const maxPage =
      totalLeave <= limitDoc ? 1 : Math.ceil(totalLeave / limitDoc);

    if (PageCount > maxPage) {
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page` });
    }

    const skip = (PageCount - 1) * limitDoc;
    const searchResults = await LeaveRequest.findAll({
      where: whereCondition,
      limit: limitDoc,
      offset: skip,
      include: [
        {
          model: UserLeave,
          attributes: ["usedLeave", "availableLeave"],
        },
        {
          model: User,
          as: "requestedBy",
          attributes: ["id", "name", "email", "roleId"],
        },
        {
          model: User,
          as: "requestedTo",
          attributes: ["id", "name", "email", "roleId"],
        },
      ],
    });
    return res.status(200).json({
      message: userMassage.success.studentList,
      searchResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: userMassage.error.genericError });
  }
};

const userLeaveStatus = async (req: Request | any, res: Response) => {
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

export {
  studentList,
  hodList,
  facultyList,
  leaveStatus,
  leaveApproval,
  allLeaveStatus,
  userLeaveStatus,
  editStudent,
};
