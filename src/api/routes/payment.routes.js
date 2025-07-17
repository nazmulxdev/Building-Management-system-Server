import { Router } from "express";
import { verifyToken, verifyMember } from "../middlewares/auth.middleware.js";
import { uploadPendingPayment } from "../controllers/payment.controller.js";

const router = Router();

router.post(
  "/checkout-payment",
  verifyToken,
  verifyMember,
  uploadPendingPayment,
);

export default router;
