import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCheck,
  FaFileLines,
  FaWandSparkles,
  FaTriangleExclamation,
} from "react-icons/fa6";
import Loader from "../components/Loader";
import { useAppStore } from "../store/useAppStore";

const sampleScope = `
Build a modern AI Scope Analyzer web application for software project planning.
The system must accept a project scope in English or Arabic,
validate the input in real time, and generate structured outputs including:
WBS, Gantt chart data, and risk log.

The dashboard must feel premium, futuristic, and highly usable.
It should support clear information hierarchy, smooth animations, responsive layout,
and a clean command-center style.

The product must allow users to paste a detailed scope description, inspect output
in a hierarchical WBS tree, review a Gantt timeline, and inspect risks with severity
levels.

The frontend must be built using React, Tailwind CSS, Zustand, Framer Motion,
React Icons, Recharts, and a Gantt visualization library.
The design should be suitable for a senior frontend engineer presentation.
`.repeat(3);

export default function Home() {
  const navigate = useNavigate();
  const setScope = useAppStore((s) => s.setScope);
  const setLoading = useAppStore((s) => s.setLoading);

  const [scopeText, setScopeText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = scopeText.length;
  const progress = Math.min((charCount / 200) * 100, 100);

  const quickCards = useMemo(
    () => [
      { title: "Scope Intake", text: "Validated textarea with 200+ chars." },
      { title: "Structured Output", text: "WBS, Gantt, and Risks in one view." },
      { title: "Premium UX", text: "Glass cards, motion, hierarchy, and dark mode." },
    ],
    []
  );

  const handleGenerate = () => {
    if (scopeText.trim().length < 200) {
      setError("Please enter at least 200 characters before generating.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoading(true);

    setTimeout(() => {
      setScope(scopeText.trim());
      setLoading(false);
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(168,85,247,0.14),_transparent_30%)]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        
        {/* Left Side */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-cyan-200">
              <FaWandSparkles />
              FRONTEND COMMAND CENTER
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-white sm:text-6xl">
              Transform raw scope into a{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                project intelligence
              </span>
              .
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Paste a detailed project scope, validate it instantly, and generate a
              premium dashboard for WBS, Gantt, and Risks.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickCards.map((card) => (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FaCheck className="text-cyan-300" />
                    {card.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex items-center"
        >
          <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
                  Scope Input
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Enter project description
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                Minimum 200 chars
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <textarea
                value={scopeText}
                onChange={(e) => setScopeText(e.target.value)}
                placeholder="Describe the project, goals, timeline, stakeholders, deliverables..."
                className="min-h-[290px] w-full resize-none rounded-2xl border border-white/10 bg-transparent p-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
              />

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-400">
                  Characters:{" "}
                  <span className="font-semibold text-white">{charCount}</span> / 200
                </div>

                <button
                  onClick={() => {
                    setScopeText(sampleScope);
                    setError("");
                  }}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Fill sample scope
                </button>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                  <FaTriangleExclamation className="mt-0.5 text-rose-300" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleGenerate}
                  disabled={isSubmitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Generating..." : "Generate Dashboard"}
                  <FaArrowRight />
                </button>

                <div className="flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-400">
                  {isSubmitting ? "Preparing dashboard..." : "Output will open in dashboard"}
                </div>
              </div>

              <div className="mt-4">
                {isSubmitting ? (
                  <Loader label="Analyzing scope and preparing WBS, Gantt, and Risks..." />
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <FaFileLines className="text-cyan-300" />
                      What happens next?
                    </div>
                    <p className="mt-2 leading-7 text-slate-400">
                      The app stores the scope in session state, then opens the dashboard
                      where outputs are displayed in a polished interface.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}