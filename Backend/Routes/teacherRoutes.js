import express from 'express';
import clubRouter from './clubRoutes.js'
import { createStudent, teacherLogin, teacherSignUp } from '../Controllers/teacherController.js';
import { authenticateTeacher } from '../Middlewares/teacherAuthMiddleWare.js';

const teacherRouter = express.Router();

teacherRouter.use('/clubs',clubRouter);

teacherRouter.post("/signup", teacherSignUp);
teacherRouter.post("/login", teacherLogin);
teacherRouter.post("/createStudent", authenticateTeacher, createStudent);

export default teacherRouter;