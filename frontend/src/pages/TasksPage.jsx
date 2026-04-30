import { useEffect, useState } from "react";
import { format } from "date-fns";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: "", projectId: "" });
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    dueDate: "",
    assignedTo: "",
    projectId: "",
  });

  const loadTasks = async () => {
    try {
      setError("");
      const { data } = await api.get("/tasks", { params: filters });
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  };

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
    if (user?.role === "ADMIN") api.get("/users").then((res) => setUsers(res.data));
  }, [user?.role]);

  useEffect(() => {
    loadTasks();
  }, [filters.status, filters.projectId]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await api.post("/tasks", form);
      setForm({ title: "", description: "", status: "TODO", dueDate: "", assignedTo: "", projectId: "" });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await api.patch(`/tasks/${id}/status`, { status });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
    }
  };

  return (
    <div className="space-y-6">
      {user?.role === "ADMIN" && (
        <form onSubmit={createTask} className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold">Create Task</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input className="rounded border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="rounded border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="rounded border p-2" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <select className="rounded border p-2" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">Project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <select className="rounded border p-2" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Assign to</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Add Task</button>
          </div>
        </form>
      )}

      <div className="flex gap-2">
        <select className="rounded border p-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select className="rounded border p-2" value={filters.projectId} onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}>
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Assignee</th>
              <th className="p-3 text-left">Due</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.project?.title}</td>
                <td className="p-3">{task.assignee?.name}</td>
                <td className="p-3">{task.dueDate ? format(new Date(task.dueDate), "dd MMM yyyy") : "-"}</td>
                <td className="p-3">
                  <select className="rounded border p-1" value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)}>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;
