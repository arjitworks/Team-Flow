import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchProjects = () => api.get("/projects").then((res) => setProjects(res.data));

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", form);
      setForm({ title: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const deleteProject = async (projectId) => {
    try {
      setError("");
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={createProject} className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Create Project</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Role required: Admin
          </span>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <input
            className="rounded border p-2 disabled:bg-slate-100"
            placeholder="Title"
            value={form.title}
            disabled={user?.role !== "ADMIN"}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="rounded border p-2 md:col-span-2 disabled:bg-slate-100"
            placeholder="Description"
            value={form.description}
            disabled={user?.role !== "ADMIN"}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        {user?.role !== "ADMIN" && (
          <p className="mt-2 text-sm text-blue-700">
            You are signed in as a member. Only admins can create projects.
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          className="mt-3 rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={user?.role !== "ADMIN"}
        >
          Create
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="group relative rounded-lg border bg-white p-4 shadow-sm">
            {user?.role === "ADMIN" && (
              <button
                type="button"
                aria-label={`Delete ${project.title}`}
                className="absolute right-3 top-3 z-10 hidden rounded p-1 text-red-600 hover:bg-red-50 group-hover:block"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478V4.5h3a.75.75 0 0 1 0 1.5h-.893l-.502 12.052A3 3 0 0 1 15.108 21H8.892a3 3 0 0 1-2.997-2.948L5.393 6H4.5a.75.75 0 0 1 0-1.5h3v-.022A2.25 2.25 0 0 1 9.75 2.25h4.5a2.25 2.25 0 0 1 2.25 2.228ZM10.5 4.5a.75.75 0 0 0-.75.75V6h4.5v-.75a.75.75 0 0 0-.75-.75h-3Z"
                    clipRule="evenodd"
                  />
                  <path d="M9.75 9.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Z" />
                </svg>
              </button>
            )}
            <Link to={`/projects/${project.id}`} className="block">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{project.description || "No description"}</p>
              <p className="mt-2 text-xs text-slate-500">{project.tasks.length} tasks</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
