import { Router } from "express";
import { getMe, getUsers } from "../controllers/user.controller.js";
import { protect, requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/me", protect, getMe);
router.get("/", protect, requireAdmin, getUsers);

export default router;
