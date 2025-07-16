import { Router } from "express";
import {
  postCoupon,
  getAllCoupons,
  updateCouponStatus,
  deleteCoupon,
  getValidCoupons,
} from "../controllers/coupons.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/coupons", verifyToken, verifyAdmin, getAllCoupons);
router.post("/coupons", verifyToken, verifyAdmin, postCoupon);
router.patch("/coupons/:id", verifyToken, verifyAdmin, updateCouponStatus);
router.delete("/coupons/:id", verifyToken, verifyAdmin, deleteCoupon);
router.get("/valid-coupons", getValidCoupons);

export default router;
