import { userMassage } from "../config/message";
import { leaveDetails } from "../config/variables";
import { LeaveRequest } from "../models/leaveRequest.model";
import { UserLeave } from "../models/userLeave.model";

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

const getuserLeaveService = async (query: any) => {
  try {
    const userLeave = await LeaveRequest.findAll(query);
    return userLeave;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
}

const getCountLeaveService = async (query: any) => {
  try {
    const userLeave = await LeaveRequest.findAndCountAll(query);
    return userLeave;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
}
const createLeaveService = async (data: any) => {
  try {
    const userLeave = await LeaveRequest.create(data);
    return userLeave;
  } catch (error) {
    console.log(error);
    throw new Error(userMassage.error.genericError);
  }
}

export { setLeave, setLeaveHod, setLeaveFaculty, getuserLeaveService, getCountLeaveService, createLeaveService };
