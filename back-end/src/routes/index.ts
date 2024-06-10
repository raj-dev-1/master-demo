import express, { Router } from "express";
import userRoute from "./user.routes";
import leaveRoutes from "./userLeave.routes";
import authRoutes from "./auth.routes";
import passport from "passport";

const routes: Router = express.Router();

routes.use("/api/v1/user", userRoute);
routes.use("/api/v1/leave", leaveRoutes);
routes.use("/api/v1/auth", authRoutes);

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

export default routes;
