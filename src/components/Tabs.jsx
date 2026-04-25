import { motion } from "framer-motion";
import {
  FaClock,
  FaDiagramProject,
  FaLayerGroup,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { useAppStore } from "../store/useAppStore";
import Tabs from "../components/Tabs";
import WBSTree from "../features/WBS/WBSView";
import GanttView from "../features/Gantt/GanttView";
import RiskTable from "../features/Risks/RiskTable";
import ChatBox from "../features/QA/ChatBox";

function StatCard({ icon, label, value, hint }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
          <p className="mt-2 text-xs leading-6 text-slate-500">{hint}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const project = useAppStore((s) => s.project);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const renderPanel = () => {
    if (activeTab === "wbs") return <WBSTree />;
    if (activeTab === "gantt") return <GanttView />;
    if (activeTab === "risks") return <RiskTable />;
    return <ChatBox />;
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.14),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),_transparent_26%)]" />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Navigation</p>

            <div className="mt-4 space-y-2">
              {[
                { id: "wbs", label: "WBS", icon: <FaDiagramProject /> },
                { id: "gantt", label: "Gantt", icon: <FaClock /> },
                { id: "risks", label: "Risks", icon: <FaTriangleExclamation /> },
                { id: "qa", label: "Q&A", icon: <FaLayerGroup /> },
              ].map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-white text-slate-950 shadow-lg shadow-cyan-500/15"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className={active ? "text-slate-950" : "text-cyan-300"}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">Project Focus</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                AI planning dashboard with WBS, Gantt, Risk Analysis, and Q&A.
              </p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Dashboard</p>
                <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                  {project.scope}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status</p>
                <p className="mt-2 text-lg font-semibold text-white">{project.subtitle}</p>
                <p className="mt-1 text-sm text-cyan-300">Unified outputs view</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<FaDiagramProject />}
                label="Tasks"
                value={project.tasksCount}
                hint="Core task count in the analysis preview"
              />
              <StatCard
                icon={<FaClock />}
                label="Duration"
                value={project.duration}
                hint="Estimated delivery window"
              />
              <StatCard
                icon={<FaTriangleExclamation />}
                label="Risks"
                value={project.risksCount}
                hint="Detected risks with severity levels"
              />
              <StatCard
                icon={<FaLayerGroup />}
                label="Confidence"
                value={`${project.confidence}%`}
                hint="Illustrative analysis confidence"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="mt-5"
            >
              <SectionHeader
                eyebrow={
                  activeTab === "wbs"
                    ? "Work Breakdown Structure"
                    : activeTab === "gantt"
                    ? "Timeline"
                    : activeTab === "risks"
                    ? "Risk Analysis"
                    : "Assistant"
                }
                title={
                  activeTab === "wbs"
                    ? "Hierarchical WBS"
                    : activeTab === "gantt"
                    ? "Interactive Gantt Chart"
                    : activeTab === "risks"
                    ? "Risk Log"
                    : "Software PM Q&A"
                }
                description={
                  activeTab === "wbs"
                    ? "A clean tree view that breaks the project into phases, tasks, and subtasks."
                    : activeTab === "gantt"
                    ? "A timeline view for visual planning and task dependencies."
                    : activeTab === "risks"
                    ? "A severity-based risk dashboard with a visual summary and detailed mitigation table."
                    : "A focused assistant that answers only software project management questions."
                }
              />

              {renderPanel()}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}