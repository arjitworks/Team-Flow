import { prisma } from "../config/prisma.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      include: {
        task: {
          select: { id: true, title: true, projectId: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    });
    return res.json(notifications);
  } catch (error) {
    return next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const current = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!current || current.userId !== req.user.id) {
      return res.status(404).json({ message: "Notification not found" });
    }
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    return next(error);
  }
};
