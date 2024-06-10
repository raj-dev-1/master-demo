import { userMassage } from "../config/message";
import { LeaveRequest } from "../models/leaveRequest.model";
import { User } from "../models/user.model";
import { UserLeave } from "../models/userLeave.model";
import { Request, Response } from "express";
import validateDates from "../utils/validateDates";
import { Sequelize } from "sequelize";
import { getPaginationParams } from "../utils/pagination";
import { pagination, role } from "../config/variables";
import { Op } from "sequelize";
import { sendLeaveUpdate } from "../utils/sendLeaveUpdate";
import moment from "moment";
import { createLeaveService, getCountLeaveService, getuserLeaveService } from "../services/leave.service";

const leaveStatus = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const query : any = {
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
    }

    const leaveStatus = await getuserLeaveService(query);

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
    const query : any = {
      where: { userId, status: "Pending" },
    }
    const checkLeave = await getCountLeaveService(query);

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

      const createLeave = await createLeaveService(leaveDetails);

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

    const {
      skip,
      limit: limitDoc,
      pageCount,
      maxPage,
    } = await getPaginationParams(LeaveRequest, whereCondition, {
      page,
      limit,
    });

    if (pageCount > maxPage) {
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} pages` });
    }

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

const advanceleaveStatus = async (req: Request | any, res: Response) => {
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

      const sendMail: any = await sendLeaveUpdate(emailDetails);
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

export {
  leaveStatus,
  applyLeave,
  leaveBalance,
  advanceleaveStatus,
  allLeaveStatus,
  userLeaveStatus,
  leaveApproval,
  leaveReport
};
