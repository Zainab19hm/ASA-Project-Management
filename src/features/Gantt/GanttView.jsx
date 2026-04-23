import { useMemo, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { FaDownload } from "react-icons/fa6";
import { useAppStore } from "../../store/useAppStore";
import { exportAnalysisAsset } from "../../api/analyzeApi";

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

export default function GanttView() {
  const project = useAppStore((s) => s.project);
  const [viewMode, setViewMode] = useState(ViewMode.Day);
  const [exporting, setExporting] = useState("");

  const stats = useMemo(() => {
    const tasks = project.ganttTasks || [];
    const dependencyLinks = tasks.reduce((sum, task) => {
      if (!task.meta?.dependencyList) return sum;
      return sum + task.meta.dependencyList.length;
    }, 0);

    const milestoneCount = tasks.filter((task) => task.type === "milestone").length;

    return {
      tasks: tasks.length,
      dependencyLinks,
      milestoneCount,
    };
  }, [project.ganttTasks]);

  const handleExport = async (format) => {
    if (!project.raw?.gantt) return;
    setExporting(format);
    try {
      const blob = await exportAnalysisAsset("gantt", format, project.raw.gantt);
      downloadBlob(blob, `gantt.${format}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to export gantt.";
      window.alert(message);
    } finally {
      setExporting("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Gantt Chart</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Dynamic timeline and dependencies</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Generated tasks are linked by dependency IDs from the same AI planning run.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
              <option value={ViewMode.Month}>Month</option>
            </select>

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

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tasks</p>
            <p className="mt-2 text-xl font-semibold text-white">{stats.tasks}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Dependencies</p>
            <p className="mt-2 text-xl font-semibold text-white">{stats.dependencyLinks}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Milestones</p>
            <p className="mt-2 text-xl font-semibold text-white">{stats.milestoneCount}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white p-3">
        {project.ganttTasks.length ? (
          <Gantt
            tasks={project.ganttTasks}
            viewMode={viewMode}
            listCellWidth="220px"
            barCornerRadius={4}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No Gantt tasks were returned from the model for this scope.
          </div>
        )}
      </div>
    </div>
  );
}
