import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FaDownload } from "react-icons/fa6";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { exportAnalysisAsset } from "../../api/analyzeApi";

const COLORS = {
  High: "#f43f5e",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export default function RiskTable() {
  const project = useAppStore((s) => s.project);
  const [exporting, setExporting] = useState("");

  const summary = [
    { name: "High", value: project.risks.filter((r) => r.severity === "High").length },
    { name: "Medium", value: project.risks.filter((r) => r.severity === "Medium").length },
    { name: "Low", value: project.risks.filter((r) => r.severity === "Low").length },
  ];

  const handleExport = async (format) => {
    if (!project.raw?.risk) return;
    setExporting(format);
    try {
      const blob = await exportAnalysisAsset("risk", format, project.raw.risk);
      downloadBlob(blob, `risk-log.${format}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to export risks.";
      window.alert(message);
    } finally {
      setExporting("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Risk Log</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Severity-based risk overview</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Risks are generated from the same scope used for WBS and Gantt planning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("pdf")}
              disabled={!!exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
            >
              <FaDownload />
              {exporting === "pdf" ? "Exporting..." : "PDF"}
            </button>
            <button
              onClick={() => handleExport("png")}
              disabled={!!exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
            >
              <FaDownload />
              {exporting === "png" ? "Exporting..." : "PNG"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={75}
                  outerRadius={120}
                  paddingAngle={3}
                >
                  {summary.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-5 py-4">Risk</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Probability</th>
                <th className="px-5 py-4">Impact</th>
                <th className="px-5 py-4">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {project.risks.length ? (
                project.risks.map((risk) => (
                  <tr key={risk.id} className="border-t border-white/10">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{risk.title}</div>
                      <div className="mt-1 text-xs text-slate-400">Severity: {risk.severity}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{risk.category}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          risk.probability === "High"
                            ? "bg-rose-500/15 text-rose-300"
                            : risk.probability === "Medium"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {risk.probability}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          risk.impact === "Critical" || risk.impact === "High"
                            ? "bg-rose-500/15 text-rose-300"
                            : risk.impact === "Medium"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {risk.impact}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{risk.mitigation}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No risks were returned from the model for this scope.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
