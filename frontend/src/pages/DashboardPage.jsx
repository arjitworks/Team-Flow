import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api/client";
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const chartData = [
    { name: "Todo", value: stats.tasksByStatus.todo },
    { name: "In Progress", value: stats.tasksByStatus.inProgress },
    { name: "Completed", value: stats.tasksByStatus.completed },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks} />
        <StatCard title="Assigned Tasks" value={stats.assignedTasks} />
        <StatCard title="Completed" value={stats.tasksByStatus.completed} />
      </div>
      <div className="h-72 rounded-lg border bg-white p-4">
        <h3 className="mb-3 font-semibold">Tasks by status</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#334155" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
