import express from 'express';
import studentRouter from './studentRoutes.js';
import teacherRouter from './teacherRoutes.js';

const appRouter = express.Router();

appRouter.use('/student',studentRouter);
appRouter.use('/teacher',teacherRouter);

export default appRouter;