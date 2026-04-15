import { motion } from "framer-motion";
import {
  FaDiagramProject,
  FaClock,
  FaTriangleExclamation,
} from "react-icons/fa6";

const tabs = [
  { id: "wbs", label: "WBS", icon: <FaDiagramProject /> },
  { id: "gantt", label: "Gantt", icon: <FaClock /> },
  { id: "risks", label: "Risks", icon: <FaTriangleExclamation /> },
];

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}