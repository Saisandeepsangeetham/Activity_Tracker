import express from 'express';
import { addClubMember, getAllClubMembers } from '../Controllers/clubMemberController.js';
import { authenticateTeacher } from './../Middlewares/teacherAuthMiddleWare.js';
import { authenticateUserForAddMember } from './../Middlewares/clubMemberAuthMiddleWare.js';
import { authenticateJWT } from './../Middlewares/JWTMiddleWare.js';

const clubMembersRoutes = express.Router();

clubMembersRoutes.get("/getMembers", authenticateTeacher, getAllClubMembers);
clubMembersRoutes.post("/addMember",authenticateJWT, authenticateUserForAddMember, addClubMember);

export default clubMembersRoutes;