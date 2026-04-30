import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project");
    }
  };

  useEffect(() => {
    load();
    if (user?.role === "ADMIN") {
      api.get("/users").then((res) => setUsers(res.data));
    }
  }, [id, user?.role]);

  const addMember = async (e) => {
    e.preventDefault();
    if (!memberId) return;
    try {
      setError("");
      await api.post(`/projects/${id}/members`, { userId: memberId });
      setMemberId("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  if (!project && !error) return <p>Loading project...</p>;
  if (!project && error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-4">
        <h2 className="text-xl font-semibold">{project.title}</h2>
        <p className="text-slate-600">{project.description || "No description"}</p>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold">Members</h3>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <ul className="mt-2 space-y-1 text-sm">
          {project.members.map((m) => (
            <li key={m.id}>{m.user.name} ({m.user.email})</li>
          ))}
        </ul>
        {user?.role === "ADMIN" && (
          <form onSubmit={addMember} className="mt-4 flex gap-2">
            <select className="flex-1 rounded border p-2" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              <option value="">Select user</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">Add</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
