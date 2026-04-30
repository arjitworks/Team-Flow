import { prisma } from "../config/prisma.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await prisma.task.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim(),
        status: req.body.status || "TODO",
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        assignedTo: req.body.assignedTo,
        projectId: req.body.projectId,
      },
      include: {
        project: {
          select: { title: true },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: task.assignedTo,
        taskId: task.id,
        message: `You have been assigned a new task: "${task.title}" in project "${task.project.title}".`,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, assignedTo, projectId } = req.query;
    const where = {
      ...(status ? { status } : {}),
      ...(assignedTo ? { assignedTo } : {}),
      ...(projectId ? { projectId } : {}),
      ...(req.user.role === "MEMBER" ? { assignedTo: req.user.id } : {}),
    };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const current = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ message: "Task not found" });
    if (req.user.role === "MEMBER" && current.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};
