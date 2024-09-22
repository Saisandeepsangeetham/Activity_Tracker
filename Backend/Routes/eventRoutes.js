import express from 'express';

import { cancelRegistration, createEvent, deleteEvent, getEventRegistrations, getEvents, getParticularEvent, registerEvent, updateEvent } from '../Controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.get("/",getEvents);

eventRouter.post("/",createEvent);

eventRouter.get("/:id", getParticularEvent);

eventRouter.put("/:id", updateEvent);

eventRouter.delete("/:id",deleteEvent);

eventRouter.get("/:id/registrations", getEventRegistrations);

eventRouter.post("/registration/:id/register", registerEvent);

eventRouter.delete("/:id/registration", cancelRegistration);

export default eventRouter;