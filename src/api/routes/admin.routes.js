import { Router } from "express";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { adminOverview } from "../controllers/admin.controller.js";

const router = Router();

router.get("/count", verifyToken, verifyAdmin, adminOverview);

export default router;
