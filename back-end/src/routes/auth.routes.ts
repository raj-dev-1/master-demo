import express, { Router } from "express";
import { uploadImgPath } from "../models/user.model";
import {
  logout,
  login,
  register,
  forgetPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller";
import passport from "passport";

const routes : Router = express.Router();

routes.post("/verifyOtp", verifyOtp);
routes.post("/login", login);
routes.post("/register", uploadImgPath, register);
routes.post("/forgetPassword", forgetPassword);
routes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

routes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

routes.put("/resetPassword", resetPassword);
routes.get("/logout", logout);

export default routes;
