import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const loadNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const intervalId = setInterval(loadNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!openNotifications) return;
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openNotifications]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      );
    } catch {
      // no-op
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch {
      // no-op
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <h1 className="text-xl font-bold">TEAM-FLOW</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/app">Dashboard</Link>
            <Link to="/app/projects">Projects</Link>
            <Link to="/app/tasks">Tasks</Link>
            <Link to="/app/profile">Profile</Link>
            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                className="relative rounded border px-3 py-1"
                onClick={() => setOpenNotifications((prev) => !prev)}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {openNotifications && (
                <div className="absolute right-0 top-11 z-20 w-96 rounded-lg border bg-white p-3 shadow-lg">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">Task notifications</p>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={markAllRead}
                    >
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-500">No notifications yet.</p>
                  ) : (
                    <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
                      {notifications.map((item) => (
                        <li
                          key={item.id}
                          className={`rounded border p-2 ${item.isRead ? "bg-white" : "bg-slate-50"}`}
                        >
                          <button
                            type="button"
                            className="w-full text-left"
                            onClick={() => markRead(item.id)}
                          >
                            <p className={item.isRead ? "text-slate-700" : "font-medium text-slate-900"}>
                              {item.message}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
              className="rounded bg-slate-800 px-3 py-1 text-white"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <p className="mb-4 text-sm text-slate-500">
          Signed in as {user?.name} ({user?.role})
        </p>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
