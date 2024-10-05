import express from 'express';
import { deleteEventRegistration, eventRegistrations, registeredStudents, registerEvent } from '../Controllers/eventRegistrationController.js';
import { authenticateJWT } from '../Middlewares/JWTMiddleWare.js';
import { authenticateUserForAddMember } from '../Middlewares/clubMemberAuthMiddleWare.js';

const eventRegisterRouter = express.Router();

eventRegisterRouter.post("/registerEvent/:id",registerEvent);
eventRegisterRouter.get("/registeredstudents/:id",authenticateJWT,authenticateUserForAddMember,registeredStudents);
eventRegisterRouter.get("/eventsregistered/:id",eventRegistrations);
eventRegisterRouter.delete("/removeregisteration/:id",deleteEventRegistration);

export default eventRegisterRouter;