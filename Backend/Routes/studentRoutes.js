import express from 'express';
import { getstudentProfileID, studentLogin, studentSignup } from '../Controllers/studentControllers.js';
import clubRouter from './clubRoutes.js';

const studentRouter = express.Router();


studentRouter.use('/clubs',clubRouter);

studentRouter.put('/signup',studentSignup);
studentRouter.post('/login',studentLogin);
studentRouter.get('/:std_id',getstudentProfileID);

export default studentRouter;