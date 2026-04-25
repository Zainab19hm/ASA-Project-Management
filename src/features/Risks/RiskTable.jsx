import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import {
  FaTriangleExclamation,
  FaShieldHalved,
  FaCircleCheck,
  FaChartLine,
  FaBolt,
  FaBug,
  FaFilePdf,
  FaFileCsv,
} from "react-icons/fa6";

/* ================= DATA ================= */

const risks = [
  {
    name: "Scope Change",
    level: "High",
    score: 85,
    action: "Mitigate",
    icon: <FaTriangleExclamation />,
  },
  {
    name: "Schedule Delay",
    level: "Medium",
    score: 60,
    action: "Track",
    icon: <FaBolt />,
  },
  {
    name: "Budget Overrun",
    level: "High",
    score: 78,
    action: "Control",
    icon: <FaShieldHalved />,
  },
  {
    name: "Bug Density",
    level: "Low",
    score: 35,
    action: "QA Review",
    icon: <FaBug />,
  },
];

const chartData = [
  { name: "High", value: 2, color: "#ef4444" },
  { name: "Medium", value: 1, color: "#f59e0b" },
  { name: "Low", value: 1, color: "#10b981" },
];

/* ================= EXPORT ================= */

function exportPDF() {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Risk Register Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Risk", "Level", "Score", "Action"]],
    body: risks.map((r) => [
      r.name,
      r.level,
      `${r.score}%`,
      r.action,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [34, 211, 238],
      textColor: 20,
    },
  });

  doc.save("risk-report.pdf");
}

function exportCSV() {
  const rows = [
    ["Risk", "Level", "Score", "Action"],
    ...risks.map((r) => [
      r.name,
      r.level,
      r.score,
      r.action,
    ]),
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((e) => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "risk-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ================= UI ================= */

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
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

function Badge({ level }) {
  const map = {
    High: "bg-red-500/15 text-red-500",
    Medium: "bg-amber-500/15 text-amber-500",
    Low: "bg-emerald-500/15 text-emerald-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${map[level]}`}
    >
      {level}
    </span>
  );
}

function Bar({ value }) {
  const color =
    value >= 75
      ? "bg-red-500"
      : value >= 50
      ? "bg-amber-400"
      : "bg-emerald-500";

  return (
    <div className="w-full">
      <div className="mb-1 text-xs text-slate-400">
        {value}%
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function RiskTable() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Risk Dashboard
          </h2>
          <p className="text-slate-500">
            Monitor threats, impact and mitigation plans.
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
        <StatCard
          title="Total Risks"
          value="4"
          icon={<FaTriangleExclamation />}
          color="bg-red-500/10 text-red-500"
        />

        <StatCard
          title="High Risks"
          value="2"
          icon={<FaShieldHalved />}
          color="bg-amber-500/10 text-amber-500"
        />

        <StatCard
          title="Mitigated"
          value="3"
          icon={<FaCircleCheck />}
          color="bg-emerald-500/10 text-emerald-500"
        />

        <StatCard
          title="Risk Score"
          value="64%"
          icon={<FaChartLine />}
          color="bg-cyan-500/10 text-cyan-500"
        />
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        {/* Chart */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900">
            Risk Distribution
          </h3>

          <div className="relative mt-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={78}
                  outerRadius={112}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-slate-400">
                Total
              </span>
              <span className="text-4xl font-black text-slate-900">
                4
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-xl">
          <h3 className="mb-4 text-xl font-bold text-slate-900">
            Risk Register
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                  <th className="px-4 py-4">Risk</th>
                  <th className="px-4 py-4">Level</th>
                  <th className="px-4 py-4">Score</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {risks.map((item, i) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {item.name}
                    </td>

                    <td className="px-4 py-4">
                      <Badge level={item.level} />
                    </td>

                    <td className="min-w-[180px] px-4 py-4">
                      <Bar value={item.score} />
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {item.action}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}