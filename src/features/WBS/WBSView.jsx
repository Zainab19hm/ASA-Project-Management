import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaDownload, FaFolderTree } from "react-icons/fa6";
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

function TreeNode({ node }) {
  const hasChildren = node.children?.length > 0;

  return (
    <details className="group rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <FaFolderTree />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{node.title}</p>
            <p className="text-xs text-slate-400">{node.owner}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 px-3 py-1">{node.effort}</span>
          {hasChildren && <FaChevronDown className="transition group-open:rotate-180" />}
        </div>
      </summary>

      {hasChildren && (
        <div className="mt-4 space-y-3 border-l border-white/10 pl-4">
          {node.children.map((child) => (
            <div key={child.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{child.title}</p>
                  <p className="text-xs text-slate-400">{child.owner}</p>
                  {child.description ? (
                    <p className="mt-1 text-xs leading-5 text-slate-500">{child.description}</p>
                  ) : null}
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  {child.effort}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </details>
  );
}

export default function WBSTree() {
  const project = useAppStore((s) => s.project);
  const [exporting, setExporting] = useState("");

  const handleExport = async (format) => {
    if (!project.raw?.wbs) return;
    setExporting(format);
    try {
      const blob = await exportAnalysisAsset("wbs", format, project.raw.wbs);
      downloadBlob(blob, `wbs.${format}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to export WBS.";
      window.alert(message);
    } finally {
      setExporting("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">WBS</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Hierarchical breakdown</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Expand each phase to inspect tasks, owners, effort, and generated descriptions.
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {project.wbs.length ? (
          project.wbs.map((node) => <TreeNode key={node.id} node={node} />)
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 text-sm text-slate-400">
            No WBS nodes were returned from the model for this scope.
          </div>
        )}
      </motion.div>
    </div>
  );
}
