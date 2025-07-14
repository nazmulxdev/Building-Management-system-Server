import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { createAgreement } from "../controllers/agreement.controller.js";

const router = Router();

router.post("/agreement", verifyToken, createAgreement);

export default router;
