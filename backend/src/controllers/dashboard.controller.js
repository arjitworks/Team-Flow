import { prisma } from "../config/prisma.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const scope = req.user.role === "MEMBER" ? { assignedTo: req.user.id } : {};
    const now = new Date();

    const [total, todo, inProgress, completed, overdue, assigned] = await Promise.all([
      prisma.task.count({ where: scope }),
      prisma.task.count({ where: { ...scope, status: "TODO" } }),
      prisma.task.count({ where: { ...scope, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { ...scope, status: "COMPLETED" } }),
      prisma.task.count({
        where: { ...scope, dueDate: { lt: now }, status: { not: "COMPLETED" } },
      }),
      prisma.task.count({ where: { assignedTo: req.user.id } }),
    ]);

    return res.json({
      totalTasks: total,
      tasksByStatus: { todo, inProgress, completed },
      overdueTasks: overdue,
      assignedTasks: assigned,
    });
  } catch (error) {
    return next(error);
  }
};
