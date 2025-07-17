import { Router } from "express";
import { verifyToken, verifyMember } from "../middlewares/auth.middleware.js";
import {
  getPendingPaymentById,
  uploadPendingPayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post(
  "/checkout-payment",
  verifyToken,
  verifyMember,
  uploadPendingPayment,
);

router.get(
  "/pending-payment/:id",
  verifyToken,
  verifyMember,
  getPendingPaymentById,
);

export default router;
