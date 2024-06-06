import express from "express";
import {  logout, profile, resetPassword} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/user.middleware";

const routes = express.Router();

routes.use(verifyToken(['student','admin','hod','faculty']));
routes.get("/profile", profile);
routes.get("/logout", logout);
routes.put("/resetPassword", resetPassword);

export default routes;