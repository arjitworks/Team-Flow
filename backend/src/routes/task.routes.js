import { Router } from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/task.controller.js";
import { protect, requireAdmin } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createTaskSchema, updateTaskStatusSchema } from "../validators/task.validator.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.post("/", requireAdmin, validate(createTaskSchema), createTask);
router.patch("/:id/status", validate(updateTaskStatusSchema), updateTaskStatus);

export default router;
