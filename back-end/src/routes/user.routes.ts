import express, { Router } from "express";
import { editFaculty, editHod, editStudent, editUser,facultyList,hodList,profile, registerFaculty, registerHod, removeUser, studentList } from "../controllers/user.controller";
import { uploadImgPath } from "../models/user.model";
import { verifyToken } from "../middlewares/user.middleware";

const routes : Router = express.Router();

routes.get("/profile", verifyToken(['student','admin','hod','faculty']), profile);
routes.get("/facultyList", verifyToken(['student','admin','hod','faculty']), facultyList);
routes.get("/studentList",verifyToken(['admin','hod','faculty']), studentList);
routes.get("/hodList",verifyToken(['admin','hod','faculty']), hodList);
routes.put("/editUser",uploadImgPath,verifyToken(['student','admin','hod','faculty']), editUser);
routes.get('/removeUser/:id',verifyToken(['admin']),removeUser);

routes.post("/registerHod", uploadImgPath,verifyToken(['admin']), registerHod);
routes.post('/registerFaculty', uploadImgPath ,verifyToken(['admin','hod']), registerFaculty);

routes.post("/editStudent/:id", uploadImgPath, verifyToken(['admin','hod','faculty']), editStudent);
routes.post("/editHod/:id", uploadImgPath,verifyToken(['admin']), editHod);
routes.post("/editFaculty/:id", uploadImgPath,verifyToken(['admin','hod']), editFaculty);

export default routes;