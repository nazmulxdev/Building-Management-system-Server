import { Router } from "express";
import { tokenController } from "../controllers/jwt.controller.js";
const router = Router();
router.post("/validation", tokenController);

export default router;
