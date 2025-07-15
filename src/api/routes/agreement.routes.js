import { Router } from "express";

import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  createAgreement,
  getAllPendingAgreement,
  updateAgreement,
} from "../controllers/agreement.controller.js";

const router = Router();

router.post("/agreement", verifyToken, createAgreement);
router.get(
  "/pending-agreements",
  verifyToken,
  verifyAdmin,
  getAllPendingAgreement,
);

router.patch(
  `/agreement-update/:id`,
  verifyToken,
  verifyAdmin,
  updateAgreement,
);

export default router;
