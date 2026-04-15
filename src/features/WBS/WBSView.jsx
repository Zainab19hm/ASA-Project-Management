import { motion } from "framer-motion";
import { FaChevronDown, FaFolderTree } from "react-icons/fa6";
import { useAppStore } from "../../store/useAppStore";

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

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">WBS</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Hierarchical breakdown</h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Expand each phase to inspect tasks, subtasks, owners, and effort.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {project.wbs.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </motion.div>
    </div>
  );
}