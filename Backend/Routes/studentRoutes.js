import express from 'express';
import { getAllstudents, getstudentProfileID, studentLogin, studentSignup } from '../Controllers/studentControllers.js';

const studentRouter = express.Router();

studentRouter.get('/',getAllstudents);
studentRouter.get('/:id',getstudentProfileID);
studentRouter.put('/signup',studentSignup);
studentRouter.post('/login',studentLogin);


export default studentRouter;