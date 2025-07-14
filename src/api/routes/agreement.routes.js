import { Router } from "express";

import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  createAgreement,
  getAllPendingAgreement,
} from "../controllers/agreement.controller.js";

const router = Router();

router.post("/agreement", verifyToken, createAgreement);
router.get(
  "/pending-agreements",
  verifyToken,
  verifyAdmin,
  getAllPendingAgreement,
);

export default router;
