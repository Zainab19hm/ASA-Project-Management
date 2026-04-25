import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaChartLine,
  FaDiagramProject,
  FaClock,
  FaTriangleExclamation,
  FaComments,
  FaLayerGroup,
  FaArrowTrendUp,
  FaMoon,
  FaSun,
} from "react-icons/fa6";

import GanttView from "../features/Gantt/GanttView";
import ChatBox from "../features/QA/ChatBox";
import RiskTable from "../features/Risks/RiskTable";

/* =========================
   WBS View
========================= */

function WBSView({ dark }) {
  const items = [
    "Initiation",
    "Planning",
    "Design",
    "Development",
    "Testing",
    "Deployment",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur-xl transition-all ${
            dark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-500">
              <FaLayerGroup />
            </div>

            <div>
              <h4
                className={`font-semibold ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                {item}
              </h4>
              <p className="text-sm text-slate-400">Project phase module</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* =========================
   Tabs
========================= */

const tabs = [
  { id: "overview", label: "Overview", icon: <FaChartLine /> },
  { id: "wbs", label: "WBS", icon: <FaDiagramProject /> },
  { id: "gantt", label: "Gantt", icon: <FaClock /> },
  { id: "risks", label: "Risks", icon: <FaTriangleExclamation /> },
  { id: "chat", label: "Assistant", icon: <FaComments /> },
];

/* =========================
   UI Helpers
========================= */

function StatCard({ dark, title, value, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className={`rounded-[2rem] border p-5 shadow-xl backdrop-blur-xl ${
        dark
          ? "border-white/10 bg-white/5"
          : "border-slate-200 bg-white/80"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3
            className={`mt-2 text-3xl font-bold ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ProgressRow({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200/70">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
        />
      </div>
    </div>
  );
}

/* =========================
   Overview
========================= */

function OverviewPanel({ dark }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          dark={dark}
          title="Tasks"
          value="42"
          icon={<FaDiagramProject />}
          color="bg-cyan-400/10 text-cyan-500"
          delay={0}
        />

        <StatCard
          dark={dark}
          title="Duration"
          value="16 Weeks"
          icon={<FaClock />}
          color="bg-violet-500/10 text-violet-500"
          delay={0.05}
        />

        <StatCard
          dark={dark}
          title="Risks"
          value="8"
          icon={<FaTriangleExclamation />}
          color="bg-red-500/10 text-red-500"
          delay={0.1}
        />

        <StatCard
          dark={dark}
          title="Progress"
          value="74%"
          icon={<FaArrowTrendUp />}
          color="bg-emerald-500/10 text-emerald-500"
          delay={0.15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2rem] border p-6 shadow-xl backdrop-blur-xl ${
            dark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/80"
          }`}
        >
          <h3
            className={`text-xl font-bold ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Project Scope
          </h3>

          <p className="mt-4 leading-8 text-slate-500">
            Build a modern AI-powered software project management dashboard
            capable of generating WBS structures, timeline schedules, risk
            analysis, and assistant responses. The system must provide a clean
            user experience, responsive design, animated UI interactions,
            maintainable architecture, and production-level visual quality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-[2rem] border p-6 shadow-xl backdrop-blur-xl ${
            dark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/80"
          }`}
        >
          <h3
            className={`text-xl font-bold ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Status Overview
          </h3>

          <div className="mt-5 space-y-5">
            <ProgressRow label="UI Design" value={92} />
            <ProgressRow label="Planning Engine" value={76} />
            <ProgressRow label="Reports" value={58} />
            <ProgressRow label="Final QA" value={41} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* =========================
   Main Dashboard
========================= */

export default function Dashboard({ dark, setDark }) {
  const [tab, setTab] = useState("overview");

  function renderContent() {
    if (tab === "overview") return <OverviewPanel dark={dark} />;
    if (tab === "wbs") return <WBSView dark={dark} />;
    if (tab === "gantt") return <GanttView />;
    if (tab === "risks") return <RiskTable />;
    return <ChatBox />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Premium Background */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 ${
          dark
            ? "bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_30%),linear-gradient(to_bottom_right,#020617,#0f172a,#020617)]"
            : "bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_30%),linear-gradient(to_bottom_right,#eef6ff,#f8fafc,#eef2ff)]"
        }`}
      />

      <div className="mx-auto max-w-[1550px] space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2.5rem] border p-7 shadow-2xl backdrop-blur-2xl ${
            dark
              ? "border-white/10 bg-white/5"
              : "border-white/70 bg-white/70"
          }`}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            ASA PROJECT
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1
                className={`text-4xl font-black sm:text-5xl ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                Smart Project Dashboard
              </h1>

              <p
                className={`mt-4 max-w-3xl leading-8 ${
                  dark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Manage planning, scope, tasks, risks, scheduling and AI
                collaboration through one elegant interface designed with React.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Button */}
              <button
                onClick={() => setDark(!dark)}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all hover:scale-105 ${
                  dark
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                {dark ? <FaSun /> : <FaMoon />}
              </button>

              {/* Status */}
              <div
                className={`rounded-3xl border px-6 py-4 ${
                  dark
                    ? "border-white/10 bg-slate-950/60"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm text-slate-400">System Status</p>
                <p className="mt-2 text-lg font-semibold text-emerald-500">
                  Operational
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((item) => {
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-lg"
                    : dark
                    ? "bg-white/5 text-slate-300 hover:bg-white/10"
                    : "bg-white/70 text-slate-700 hover:bg-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-xl ${
            dark
              ? "border-white/10 bg-white/5"
              : "border-white/70 bg-white/70"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}