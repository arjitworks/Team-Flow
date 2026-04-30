import { useState } from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Role-based control",
    text: "Admins manage projects and assignments while members stay focused on execution.",
  },
  {
    title: "Task clarity",
    text: "Track progress by status, due date, and ownership with clear accountability.",
  },
  {
    title: "Team visibility",
    text: "See live dashboard metrics for overdue, in-progress, and completed work.",
  },
];

const LandingPage = () => {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <h1 className="text-xl font-bold tracking-wide">TEAM-FLOW</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Project productivity platform
            </p>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Build faster with organized team execution.
            </h2>
            <p className="mt-4 text-slate-600">
              TEAM-FLOW helps teams plan projects, assign tasks, and track delivery without confusion.
              Use role-based access, clear task states, and dashboard insights to finish work on time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
              >
                Start Project
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-100"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Why teams use TEAM-FLOW</h3>
            <div className="mt-4 space-y-3">
              {highlights.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveCard(idx)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    activeCard === idx
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <p className="font-medium">{item.title}</p>
                  {activeCard === idx && (
                    <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
