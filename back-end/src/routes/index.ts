import express, { Router } from "express";
import userRoute from "./user.routes";
import leaveRoutes from "./userLeave.routes";
import authRoutes from "./auth.routes";

const routes: Router = express.Router();

routes.use("/api/v1/user", userRoute);
routes.use("/api/v1/leave", leaveRoutes);
routes.use("/api/v1/auth", authRoutes);

export default routes;
