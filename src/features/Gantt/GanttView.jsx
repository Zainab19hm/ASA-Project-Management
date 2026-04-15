import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useAppStore } from "../../store/useAppStore";

export default function GanttView() {
  const project = useAppStore((s) => s.project);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Gantt Chart</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Timeline with dependencies</h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Horizontal timeline view for visual planning and task sequencing.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white p-3">
        <Gantt tasks={project.ganttTasks} viewMode={ViewMode.Day} />
      </div>
    </div>
  );
}