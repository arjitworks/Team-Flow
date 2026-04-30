import { Router } from "express";
import {
  addMemberToProject,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeMemberFromProject,
} from "../controllers/project.controller.js";
import { protect, requireAdmin } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { addMemberSchema, createProjectSchema } from "../validators/project.validator.js";

const router = Router();

router.use(protect);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", requireAdmin, validate(createProjectSchema), createProject);
router.post("/:id/members", requireAdmin, validate(addMemberSchema), addMemberToProject);
router.delete("/:id/members/:userId", requireAdmin, removeMemberFromProject);
router.delete("/:id", requireAdmin, deleteProject);

export default router;
