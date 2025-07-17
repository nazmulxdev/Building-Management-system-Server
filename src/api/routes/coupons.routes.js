import { Router } from "express";
import {
  postCoupon,
  getAllCoupons,
  updateCouponStatus,
  deleteCoupon,
  getValidCoupons,
  validateCoupon,
} from "../controllers/coupons.controller.js";
import {
  verifyAdmin,
  verifyMember,
  verifyToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/coupons", verifyToken, verifyAdmin, getAllCoupons);
router.post("/coupons", verifyToken, verifyAdmin, postCoupon);
router.patch("/coupons/:id", verifyToken, verifyAdmin, updateCouponStatus);
router.delete("/coupons/:id", verifyToken, verifyAdmin, deleteCoupon);
router.get("/valid-coupons", getValidCoupons);
router.post("/validate-coupon", verifyToken, verifyMember, validateCoupon);

export default router;
