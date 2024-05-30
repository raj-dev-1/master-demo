import express from "express";
import {  logout, profile} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/user.middleware";

const routes = express.Router();

routes.use(verifyToken(['student','admin','hod','faculty']));
routes.get("/profile", profile);
routes.get("/logout", logout);

export default routes;