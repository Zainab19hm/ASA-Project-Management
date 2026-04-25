import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FaChevronRight,
  FaChevronDown,
  FaFolderTree,
  FaLayerGroup,
  FaListCheck,
  FaCodeBranch,
  FaFilePdf,
  FaFileCsv,
} from "react-icons/fa6";

/* ================= DATA ================= */

const wbsData = [
  {
    id: 1,
    title: "Initiation",
    color: "from-cyan-400 to-blue-500",
    tasks: [
      "Business Case",
      "Stakeholder Identification",
      "Project Charter",
    ],
  },
  {
    id: 2,
    title: "Planning",
    color: "from-violet-400 to-fuchsia-500",
    tasks: [
      "Requirements Gathering",
      "Scope Definition",
      "Schedule Planning",
      "Budget Planning",
    ],
  },
  {
    id: 3,
    title: "Design",
    color: "from-emerald-400 to-teal-500",
    tasks: [
      "Wireframes",
      "UI Design",
      "System Architecture",
    ],
  },
  {
    id: 4,
    title: "Development",
    color: "from-amber-400 to-orange-500",
    tasks: [
      "Frontend Implementation",
      "Backend APIs",
      "Database Setup",
      "Integrations",
    ],
  },
  {
    id: 5,
    title: "Testing",
    color: "from-rose-400 to-pink-500",
    tasks: [
      "Unit Testing",
      "Integration Testing",
      "UAT",
      "Bug Fixing",
    ],
  },
  {
    id: 6,
    title: "Deployment",
    color: "from-indigo-400 to-purple-500",
    tasks: [
      "Production Release",
      "Monitoring",
      "Handover",
    ],
  },
];

/* ================= EXPORT ================= */

function exportPDF() {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("WBS Report", 14, 20);

  const rows = [];

  wbsData.forEach((phase) => {
    phase.tasks.forEach((task) => {
      rows.push([phase.title, task]);
    });
  });

  autoTable(doc, {
    startY: 30,
    head: [["Phase", "Task"]],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [34, 211, 238],
      textColor: 20,
    },
  });

  doc.save("wbs-report.pdf");
}

function exportCSV() {
  const rows = [["Phase", "Task"]];

  wbsData.forEach((phase) => {
    phase.tasks.forEach((task) => {
      rows.push([phase.title, task]);
    });
  });

  const csv =
    "data:text/csv;charset=utf-8," +
    rows.map((r) => r.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "wbs-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ================= HEADER ================= */

function HeaderCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
            <FaFolderTree className="text-xl" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-500">
              Work Breakdown Structure
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Hierarchical Project Structure
            </h2>
          </div>
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

      <p className="mt-5 max-w-4xl leading-8 text-slate-600">
        Break the project into phases, deliverables and manageable tasks.
        Improve ownership, planning accuracy, execution clarity and control.
      </p>
    </motion.div>
  );
}

/* ================= STATS ================= */

function StatCards() {
  const totalPhases = wbsData.length;
  const totalTasks = wbsData.reduce(
    (sum, item) => sum + item.tasks.length,
    0
  );

  const cards = [
    {
      label: "Phases",
      value: totalPhases,
      icon: <FaLayerGroup />,
      color: "text-cyan-500 bg-cyan-500/10",
    },
    {
      label: "Tasks",
      value: totalTasks,
      icon: <FaListCheck />,
      color: "text-violet-500 bg-violet-500/10",
    },
    {
      label: "Depth",
      value: "3 Levels",
      icon: <FaCodeBranch />,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {card.value}
              </h3>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================= NODE ================= */

function WBSNode({ item, index }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-xl"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 rounded-2xl p-2 text-left hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="text-slate-500">
            {open ? <FaChevronDown /> : <FaChevronRight />}
          </div>

          <div
            className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.color}`}
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500">
              {item.tasks.length} tasks
            </p>
          </div>
        </div>

        <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600">
          Phase
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-l border-slate-200 pl-6">
              {item.tasks.map((task, i) => (
                <motion.div
                  key={task}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${item.color}`}
                  />

                  <span className="text-sm text-slate-700">
                    {task}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================= MAIN ================= */

export default function WBSView() {
  return (
    <div className="space-y-6">
      <HeaderCard />
      <StatCards />

      <div className="grid gap-4 xl:grid-cols-2">
        {wbsData.map((item, index) => (
          <WBSNode
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}