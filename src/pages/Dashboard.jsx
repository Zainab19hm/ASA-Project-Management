import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaClock, FaTriangleExclamation, FaDiagramProject, FaArrowLeft } from "react-icons/fa6";
import { useAppStore } from "../store/useAppStore";
import Tabs from "../components/Tabs";
import WBSTree from "../features/WBS/WBSView";
import GanttView from "../features/Gantt/GanttView";
import RiskTable from "../features/Risks/RiskTable";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">No Analysis Yet</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Generate a project scope first</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          The dashboard is dynamic and only renders AI-generated WBS, Gantt, and Risk data.
        </p>
        <Link
          to="/"
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950"
        >
          <FaArrowLeft />
          Go To Scope Input
        </Link>
      </div>
    </main>
  );
}

export default function Dashboard() {
  const project = useAppStore((s) => s.project);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const error = useAppStore((s) => s.error);

  const hasData =
    project.wbs.length > 0 || project.ganttTasks.length > 0 || project.risks.length > 0;

  if (!hasData) return <EmptyState />;

  const renderPanel = () => {
    if (activeTab === "wbs") return <WBSTree />;
    if (activeTab === "gantt") return <GanttView />;
    return <RiskTable />;
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Navigation</p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setActiveTab("wbs")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  activeTab === "wbs"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FaDiagramProject />
                WBS
              </button>

              <button
                onClick={() => setActiveTab("gantt")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  activeTab === "gantt"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FaClock />
                Gantt
              </button>

              <button
                onClick={() => setActiveTab("risks")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  activeTab === "risks"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FaTriangleExclamation />
                Risks
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">Project Focus</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Dynamic AI-generated scope planning with linked execution artifacts.
              </p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
                <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{project.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{project.scope}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status</p>
                <p className="mt-2 text-lg font-semibold text-white">{project.subtitle}</p>
                <p className="mt-1 text-sm text-cyan-300">Live backend AI data</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Tasks" value={project.tasksCount} hint="Total planned tasks" />
              <StatCard label="Duration" value={project.duration} hint="Estimated timeline" />
              <StatCard label="Risks" value={project.risksCount} hint="Detected risks" />
              <StatCard label="Confidence" value={`${project.confidence}%`} hint="Data completeness" />
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-4">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-2"
            >
              {renderPanel()}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
