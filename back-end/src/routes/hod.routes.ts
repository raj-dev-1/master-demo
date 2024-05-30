import express from "express";
import { verifyToken } from "../middlewares/user.middleware";
import { editFaculty, registerFaculty } from "../controllers/hod.controller";
import { uploadImgPath } from "../models/user.model";

const routes = express.Router();

routes.use(verifyToken(['hod','admin']));

routes.post('/registerFaculty', uploadImgPath , registerFaculty);
routes.post('/editFaclty/:id', uploadImgPath , editFaculty);

export default routes;
