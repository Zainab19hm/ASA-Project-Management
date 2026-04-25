import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FaClipboardCheck,
  FaPalette,
  FaCode,
  FaBug,
  FaRocket,
  FaFilePdf,
  FaFileCsv,
} from "react-icons/fa6";

/* ================= DATA ================= */

const tasks = [
  {
    phase: "Planning",
    task: "Requirement Analysis",
    owner: "PM Team",
    start: 0,
    width: 15,
    progress: 100,
    color: "from-blue-500 to-cyan-400",
    icon: <FaClipboardCheck />,
  },
  {
    phase: "Design",
    task: "UI / UX Design",
    owner: "Design Team",
    start: 12,
    width: 22,
    progress: 92,
    color: "from-violet-500 to-fuchsia-400",
    icon: <FaPalette />,
  },
  {
    phase: "Development",
    task: "Frontend Development",
    owner: "Frontend Team",
    start: 32,
    width: 38,
    progress: 76,
    color: "from-cyan-500 to-sky-400",
    icon: <FaCode />,
  },
  {
    phase: "Testing",
    task: "System Testing",
    owner: "QA Team",
    start: 68,
    width: 16,
    progress: 58,
    color: "from-amber-500 to-yellow-400",
    icon: <FaBug />,
  },
  {
    phase: "Deployment",
    task: "Launch Project",
    owner: "DevOps",
    start: 84,
    width: 14,
    progress: 24,
    color: "from-emerald-500 to-green-400",
    icon: <FaRocket />,
  },
];

/* ================= EXPORT ================= */

function exportPDF() {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Project Gantt Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Task", "Phase", "Owner", "Progress"]],
    body: tasks.map((t) => [
      t.task,
      t.phase,
      t.owner,
      `${t.progress}%`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [34, 211, 238],
      textColor: 20,
    },
  });

  doc.save("gantt-report.pdf");
}

function exportCSV() {
  const rows = [
    ["Task", "Phase", "Owner", "Progress"],
    ...tasks.map((t) => [
      t.task,
      t.phase,
      t.owner,
      t.progress,
    ]),
  ];

  const csv =
    "data:text/csv;charset=utf-8," +
    rows.map((e) => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "gantt-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ================= UI ================= */

function Card({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur-xl"
    >
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className={`mt-2 text-3xl font-black ${color}`}>
        {value}
      </h3>
    </motion.div>
  );
}

/* ================= MAIN ================= */

export default function GanttView() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Project Timeline
          </h2>

          <p className="mt-1 text-slate-500">
            Smart scheduling and progress visualization.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-lg hover:scale-105 transition"
          >
            <FaFilePdf />
            PDF
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-white shadow-lg hover:scale-105 transition"
          >
            <FaFileCsv />
            CSV
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Tasks" value="5" color="text-cyan-500" />
        <Card title="Duration" value="16 Weeks" color="text-violet-500" />
        <Card title="Completed" value="2" color="text-emerald-500" />
        <Card title="Progress" value="70%" color="text-blue-500" />
      </div>

      {/* Board */}
      <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
        {/* Weeks */}
        <div className="mb-4 grid grid-cols-[280px_repeat(16,minmax(0,1fr))] gap-2">
          <div />

          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-100 py-2 text-center text-xs font-semibold text-slate-500"
            >
              W{i + 1}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-4">
          {tasks.map((item, index) => (
            <motion.div
              key={item.task}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="grid grid-cols-[280px_1fr] gap-4"
            >
              {/* Left */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      {item.task}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {item.owner}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-600">
                    {item.phase}
                  </span>

                  <span className="font-semibold text-slate-500">
                    {item.progress}%
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative flex h-[96px] items-center rounded-3xl bg-slate-50 px-2">
                <div className="absolute inset-0 grid grid-cols-16 gap-2 px-2 py-3">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-slate-100"
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.width}%` }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.1,
                  }}
                  style={{ left: `${item.start}%` }}
                  className={`absolute h-12 rounded-2xl bg-gradient-to-r ${item.color} shadow-lg`}
                >
                  <div className="flex h-full items-center justify-between px-4 text-sm font-bold text-white">
                    <span>{item.phase}</span>
                    <span>{item.progress}%</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] bg-gradient-to-r from-cyan-500 to-violet-500 p-6 text-white shadow-xl"
      >
        <h3 className="text-xl font-bold">
          Schedule Insight
        </h3>

        <p className="mt-2 leading-8 text-white/90">
          Development is the critical path. Add QA support before testing
          to maintain launch readiness.
        </p>
      </motion.div>
    </div>
  );
}