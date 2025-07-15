import { Router } from "express";
import {
  getMembers,
  getUserRole,
  removeMemberStatus,
  userDataPost,
} from "../controllers/users.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/users", userDataPost);
router.get("/users/role/:email", verifyToken, getUserRole);
router.get("/users/members", verifyToken, verifyAdmin, getMembers);
router.patch(
  "/users/remove-member/:userId",
  verifyToken,
  verifyAdmin,
  removeMemberStatus,
);

export default router;
