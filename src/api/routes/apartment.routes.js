import { Router } from "express";
import { getAllApartments } from "../controllers/apartment.controller.js";

const router = Router();

router.get("/apartments", getAllApartments);

export default router;
