import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useAppStore } from "../../store/useAppStore";

const COLORS = {
  High: "#f43f5e",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

export default function RiskTable() {
  const project = useAppStore((s) => s.project);

  const summary = [
    { name: "High", value: project.risks.filter((r) => r.severity === "High").length },
    { name: "Medium", value: project.risks.filter((r) => r.severity === "Medium").length },
    { name: "Low", value: project.risks.filter((r) => r.severity === "Low").length },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Risk Log</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Severity-based risk overview</h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          The chart and table help users understand threats and mitigation plans fast.
        </p>
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
              {project.risks.map((risk) => (
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
                          : "bg-amber-500/15 text-amber-300"
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
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {risk.impact}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{risk.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}