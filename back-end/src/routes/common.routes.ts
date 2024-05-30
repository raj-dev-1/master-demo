import express from "express";
import { applyLeave, editUser, leaveBalance, login, logout, profile } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/user.middleware";
import { allLeaveStatus, editStudent, facultyList, hodList, leaveApproval, leaveStatus, studentList, userLeaveStatus } from "../controllers/common.controller";
import { uploadImgPath } from "../models/user.model";

const routes = express.Router();

routes.post('/login', login);
routes.get('logout',logout);

routes.use(verifyToken(['admin','hod','faculty']));

routes.get("/studentList", studentList);
routes.get("/hodList", hodList);
routes.get("/facultyList",facultyList);
routes.get("/leaveStatus", leaveStatus);
routes.post("/leaveApproval/:id", leaveApproval);
routes.get("/profile", profile);
routes.get("/leaveBalance", leaveBalance);
routes.post("/applyLeave", applyLeave);
routes.get("/allLeaveStatus", allLeaveStatus);
routes.get("/userLeaveStatus", userLeaveStatus);

routes.put("/editUser", uploadImgPath, editUser);
routes.patch("/editStudent/:id", uploadImgPath, editStudent);

export default routes;
