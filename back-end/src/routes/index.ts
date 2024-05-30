import express, { Router } from "express";
import studentRoute from "./student.routes";
import commonRoute from "./common.routes";
import passport from "passport";

const routes: Router = express.Router();

routes.use("/user", studentRoute);
routes.use("/manage", commonRoute);

routes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

routes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  function (req, res) {
    res.redirect("/home");
  }
);

export default routes;
