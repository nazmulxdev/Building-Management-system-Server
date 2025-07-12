import { Router } from "express";
import { getUserRole, userDataPost } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/users", userDataPost);
router.get("/users/role/:email", verifyToken, getUserRole);

export default router;
