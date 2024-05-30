import express from "express";
import { login, register, leaveStatus, applyLeave, leaveBalance, editUser, logout, verifyOtp, forgetPassword, resetPassword } from "../controllers/user.controller";
import { uploadImgPath } from "../models/user.model";
import { verifyToken } from "../middlewares/user.middleware";
import allRoute from './all.routes';
const routes = express.Router();

routes.post("/login", login);
routes.post("/register", uploadImgPath, register);
routes.post("/forgetPassword", forgetPassword);
routes.post("/verifyOtp", verifyOtp);
routes.put("/resetPassword", resetPassword);

routes.use("/",allRoute);

routes.use(verifyToken(["student"]));

routes.post("/applyLeave", applyLeave);
routes.get("/logout", logout);
routes.get("/leaveStatus", leaveStatus);
routes.get("/leaveBalance", leaveBalance);
routes.put("/editUser", uploadImgPath, editUser);


export default routes;
