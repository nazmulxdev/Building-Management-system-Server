import { Router } from "express";
import upload from "../middlewares/upload.middlewares.js";
import { uploadImage } from "../controllers/cloudinary.controller.js";

const router = Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;
