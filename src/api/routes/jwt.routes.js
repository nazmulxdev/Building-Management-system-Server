import { Router } from "express";
import {
  tokenController,
  unMountToken,
} from "../controllers/jwt.controller.js";
const router = Router();
router.post("/validation", tokenController);
router.post("/logout", unMountToken);

export default router;
