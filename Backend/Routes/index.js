import express from 'express';
import studentRouter from './studentRoutes.js';
import teacherRouter from './teacherRoutes.js';
import clubMembersRoutes from './clubMembersRoutes.js';

const appRouter = express.Router();

appRouter.use('/clubMembers', clubMembersRoutes);
appRouter.use('/student',studentRouter);
appRouter.use('/teacher',teacherRouter);

export default appRouter;