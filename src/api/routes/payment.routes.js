import { Router } from "express";
import { verifyToken, verifyMember } from "../middlewares/auth.middleware.js";
import {
  getPendingPaymentById,
  paymentIntent,
  updatePaymentById,
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

router.post("/payment-intent", verifyToken, verifyMember, paymentIntent);

router.post(
  "/update-payment/:id",
  verifyToken,
  verifyMember,
  updatePaymentById,
);

export default router;
