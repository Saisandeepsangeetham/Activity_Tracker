import express from "express";
import { deleteRole, getRoleInformation, getRoles, newRole } from "../Controllers/rolesController.js";


const rolesRouter = express.Router();

rolesRouter.get("/",getRoles);

rolesRouter.get("/:id",getRoleInformation);

rolesRouter.post("/",newRole);

rolesRouter.delete("/:id",deleteRole);

export default rolesRouter;


