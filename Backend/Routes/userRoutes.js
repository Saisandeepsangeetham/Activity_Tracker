import express from "express";
import { createUser, getAllUsers, jwtVerify, loginUser } from "../Controllers/userController.js";
import { authVerification } from "../Middlewares/jwtAuthMiddleWare.js";

const authRoutes = express.Router();

authRoutes.get("/", getAllUsers);

authRoutes.post("/signup", createUser);

authRoutes.post("/login", loginUser);

authRoutes.get("/loginJWT", authVerification, jwtVerify);

export default authRoutes;