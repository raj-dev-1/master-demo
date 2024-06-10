import express from "express";
import { uploadImgPath } from "../models/user.model";
import { logout, login, register, forgetPassword, verifyOtp, resetPassword } from "../controllers/auth.controller";

const routes = express.Router();

routes.post("/login", login);
routes.post("/register", uploadImgPath, register);
routes.post("/forgetPassword", forgetPassword);
routes.post("/verifyOtp", verifyOtp);
routes.get('logout',logout);
routes.put("/resetPassword", resetPassword);

export default routes;