import { prisma } from "../config/prisma.js";

const canAccessProject = async (projectId, userId, role) => {
  if (role === "ADMIN") return true;
  const membership = await prisma.projectMember.findFirst({
    where: { projectId, userId },
  });
  return Boolean(membership);
};

export const createProject = async (req, res, next) => {
  try {
    const project = await prisma.project.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim(),
        createdById: req.user.id,
      },
    });
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: req.user.id, role: "ADMIN" },
    });
    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const where =
      req.user.role === "ADMIN"
        ? {}
        : { members: { some: { userId: req.user.id } } };
    const projects = await prisma.project.findMany({
      where,
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const allowed = await canAccessProject(req.params.id, req.user.id, req.user.role);
    if (!allowed) return res.status(403).json({ message: "Forbidden" });
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
        tasks: { include: { assignee: { select: { id: true, name: true, email: true } } } },
      },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

export const addMemberToProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.projectMember.findFirst({
      where: { projectId: id, userId: req.body.userId },
    });
    if (existing) return res.status(409).json({ message: "Member already added" });
    const member = await prisma.projectMember.create({
      data: { projectId: id, userId: req.body.userId, role: req.body.role || "MEMBER" },
    });
    return res.status(201).json(member);
  } catch (error) {
    return next(error);
  }
};

export const removeMemberFromProject = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    await prisma.projectMember.deleteMany({ where: { projectId: id, userId } });
    return res.json({ message: "Member removed" });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    return res.json({ message: "Project deleted" });
  } catch (error) {
    return next(error);
  }
};
