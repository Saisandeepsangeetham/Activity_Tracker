import express from 'express';
import clubRouter from './clubRoutes.js'
import { createStudent, createTeacher, getAllStudents, teacherLogin } from '../Controllers/teacherController.js';
import { authenticateHod, authenticateTeacher } from '../Middlewares/teacherAuthMiddleWare.js';
import { authenticateJWT } from './../Middlewares/JWTMiddleWare.js';

const teacherRouter = express.Router();

teacherRouter.use('/clubs',clubRouter);

// teacherRouter.post("/signup", teacherSignUp);
teacherRouter.post("/createTeacher", authenticateJWT, authenticateHod, createTeacher);
teacherRouter.post("/login", teacherLogin);
teacherRouter.post("/createStudent", authenticateJWT, authenticateTeacher, createStudent);
teacherRouter.get("/getStudents", authenticateJWT, authenticateTeacher, getAllStudents);

export default teacherRouter;