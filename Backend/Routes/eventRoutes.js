import express from "express";
import { addEvent, deleteEvent, getAllEvents, getEvent, getEventsByCategory, getEventsByClub, updateEvent } from "../Controllers/eventController.js";
import { authenticateJWT } from "../Middlewares/JWTMiddleWare.js";
import { authenticatePresidentVP } from "../Middlewares/clubMemberAuthMiddleWare.js";

const eventRouter = express.Router();

eventRouter.get("/allevents", getAllEvents);
eventRouter.get("/clubwise/:clubId", getEventsByClub);
eventRouter.get("/categorywise/:categoryId", getEventsByCategory);
eventRouter.get("/:eventId", getEvent);
eventRouter.post("/createevent", authenticateJWT, authenticatePresidentVP, addEvent);
eventRouter.post("/update/:eventId", authenticateJWT, authenticatePresidentVP, updateEvent);
eventRouter.delete("/delete/:eventId", authenticateJWT, authenticatePresidentVP, deleteEvent);

export default eventRouter;