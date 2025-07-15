import { Router } from "express";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllAnnouncements,
  postAnnouncement,
} from "../controllers/announcements.controller.js";
const router = Router();

router.post("/announcements", verifyToken, verifyAdmin, postAnnouncement);
router.get("/announcements", verifyToken, getAllAnnouncements);

export default router;
