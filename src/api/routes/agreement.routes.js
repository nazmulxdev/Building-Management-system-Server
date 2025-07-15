import { Router } from "express";

import {
  verifyAdmin,
  verifyMember,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import {
  createAgreement,
  getAgreementByEmail,
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

router.get(
  `/member-agreement/:email`,
  verifyToken,
  verifyMember,
  getAgreementByEmail,
);

export default router;
