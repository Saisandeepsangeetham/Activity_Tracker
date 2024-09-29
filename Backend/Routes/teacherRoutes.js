import express from 'express';
import clubRouter from './clubRoutes.js'
import { createStudent, createTeacher, getAllStudents, teacherLogin, teacherSignUp } from '../Controllers/teacherController.js';
import { authenticateHod, authenticateTeacher } from '../Middlewares/teacherAuthMiddleWare.js';

const teacherRouter = express.Router();

teacherRouter.use('/clubs',clubRouter);

// teacherRouter.post("/signup", teacherSignUp);
teacherRouter.post("/createTeacher", authenticateHod, createTeacher);
teacherRouter.post("/login", teacherLogin);
teacherRouter.post("/createStudent", authenticateTeacher, createStudent);
teacherRouter.get("/getStudents", authenticateTeacher, getAllStudents);

export default teacherRouter;