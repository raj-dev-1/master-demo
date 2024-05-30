import express from 'express';
import { verifyToken } from '../middlewares/user.middleware';
import { allLeaveStatus, leaveApproval } from '../controllers/common.controller';
import { editHod, leaveReport, registerHod, removeUser } from '../controllers/admin.controller';
import { uploadImgPath } from '../models/user.model';
import {  editFaculty, registerFaculty } from '../controllers/hod.controller';
const routes = express.Router();

routes.use(verifyToken(['admin']));

routes.get("/allLeaveStatus", allLeaveStatus);
routes.post("/leaveApproval/:id", leaveApproval);
routes.get('/removeUser/:id',removeUser);
routes.get("/leaveReport", leaveReport);

routes.post("/registerHod", uploadImgPath, registerHod);
routes.post("/editHod/:id", uploadImgPath, editHod);

routes.post('/registerFaculty', uploadImgPath , registerFaculty);
routes.post("/editFaculty/:id", uploadImgPath, editFaculty);

export default routes;
