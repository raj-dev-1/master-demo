import express from "express";
import { verifyToken } from "../middlewares/user.middleware";
import {
  advanceleaveStatus,
  allLeaveStatus,
  applyLeave,
  leaveApproval,
  leaveBalance,
  leaveReport,
  leaveStatus,
  userLeaveStatus,
} from "../controllers/userLeave.controller";

const routes = express.Router();

routes.get("/userleaveStatus",verifyToken(['student','admin','hod','faculty']), leaveStatus);
routes.get("/leaveStatus",verifyToken(['student','admin','hod','faculty']), advanceleaveStatus);
routes.get("/leaveBalance",verifyToken(['student','admin','hod','faculty']), leaveBalance);
routes.get("/allLeaveStatus",verifyToken(['admin','hod','faculty']), allLeaveStatus);
routes.get("/userLeaveStatus",verifyToken(['admin','hod','faculty']), userLeaveStatus);
routes.post("/applyLeave",verifyToken(['student']), applyLeave);
routes.post("/leaveApproval/:id", verifyToken(['admin','hod','faculty']),leaveApproval);
routes.get("/leaveReport",verifyToken(['admin']), leaveReport);

export default routes;