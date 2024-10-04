import express from 'express';
import studentRouter from './studentRoutes.js';
import teacherRouter from './teacherRoutes.js';
import clubMembersRoutes from './clubMembersRoutes.js';
import eventRouter from './eventRoutes.js';

const appRouter = express.Router();

appRouter.use('/clubMembers', clubMembersRoutes);
appRouter.use('/events', eventRouter);
appRouter.use('/student',studentRouter);
appRouter.use('/teacher',teacherRouter);

export default appRouter;