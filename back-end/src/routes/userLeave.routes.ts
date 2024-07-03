import express, { Router } from "express";
import { verifyToken } from "../middlewares/user.middleware";
import {
  advanceleaveStatus,
  allLeaveStatus,
  applyLeave,
  leaveApproval,
  leaveBalance,
  leaveReport,
  leaveStatus,
} from "../controllers/userLeave.controller";

const routes: Router = express.Router();

routes.get("/leaveStatus",verifyToken(['student','admin','hod','faculty']), leaveStatus);
routes.get("/advanceleaveStatus",verifyToken(['student','admin','hod','faculty']), advanceleaveStatus);
routes.get("/leaveBalance",verifyToken(['student','admin','hod','faculty']), leaveBalance);
routes.get("/allLeaveStatus",verifyToken(['admin','hod','faculty']), allLeaveStatus);
routes.post("/applyLeave",verifyToken(['student','faculty']), applyLeave);
routes.post("/leaveApproval/:id", verifyToken(['admin','hod','faculty']),leaveApproval);
routes.get("/leaveReport",verifyToken(['admin']), leaveReport);

export default routes;