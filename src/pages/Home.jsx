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
import { analyzeScope } from "../api/analyzeApi";
import { buildProjectFromAnalysis } from "../utils/projectTransform";

const MIN_SCOPE_CHARS = 200;

const sampleScope = `Build an AI scope analyzer for software delivery planning.
The system receives a project scope, then generates WBS, Gantt schedule, and risk log.
The frontend should display linked data views where task IDs and dependencies remain consistent between WBS and Gantt.
The app must support export to PDF and PNG, and should provide resilient UX with loading, errors, and retries.
The stack includes React frontend, Django backend, and AI model services for analysis generation.
The final dashboard should be responsive, clear, and suitable for stakeholder review.`;

export default function Home() {
  const navigate = useNavigate();
  const setScope = useAppStore((s) => s.setScope);
  const setLoading = useAppStore((s) => s.setLoading);
  const setProject = useAppStore((s) => s.setProject);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setErrorState = useAppStore((s) => s.setError);

  const [scopeText, setScopeText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = scopeText.length;
  const progress = Math.min((charCount / MIN_SCOPE_CHARS) * 100, 100);

  const quickCards = useMemo(
    () => [
      { title: "Live AI Analysis", text: "Generates WBS, Gantt, and Risk from your real scope." },
      { title: "Linked Planning Data", text: "Tasks and dependencies stay connected between views." },
      { title: "Dynamic Dashboard", text: "No mock data. Every run is generated fresh." },
    ],
    [],
  );

  const handleGenerate = async () => {
    const trimmedScope = scopeText.trim();

    if (trimmedScope.length < MIN_SCOPE_CHARS) {
      setError(`Please enter at least ${MIN_SCOPE_CHARS} characters before generating.`);
      return;
    }

    setError("");
    setErrorState("");
    setIsSubmitting(true);
    setLoading(true);

    try {
      const analysis = await analyzeScope(trimmedScope);
      const project = buildProjectFromAnalysis(trimmedScope, analysis);

      setScope(trimmedScope);
      setProject(project);
      setActiveTab("wbs");
      navigate("/dashboard");
    } catch (err) {
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? Number(err.status)
          : null;
      const message =
        status === 503
          ? "AI analysis is temporarily unavailable after 3 retry attempts. Please try again in a minute."
          : err instanceof Error
            ? err.message
            : "Analysis failed. Please try again.";
      setError(message);
      setErrorState(message);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(168,85,247,0.14),_transparent_30%)]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-cyan-200">
              <FaWandSparkles />
              LIVE AI MODE
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-white sm:text-6xl">
              Turn scope into a{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                dynamic project plan
              </span>
              .
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Enter your real scope and generate linked WBS, Gantt, and Risk outputs directly from AI.
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex items-center"
        >
          <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Scope Input</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Generate real project outputs</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                Minimum {MIN_SCOPE_CHARS} chars
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <textarea
                value={scopeText}
                onChange={(e) => setScopeText(e.target.value)}
                placeholder="Describe objectives, deliverables, roles, timeline, dependencies, and risks..."
                className="min-h-[290px] w-full resize-none rounded-2xl border border-white/10 bg-transparent p-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
              />

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-400">
                  Characters: <span className="font-semibold text-white">{charCount}</span> / {MIN_SCOPE_CHARS}
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
                  {isSubmitting ? "Analyzing..." : "Generate Dynamic Dashboard"}
                  <FaArrowRight />
                </button>

                <div className="flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-400">
                  {isSubmitting ? "AI is generating planning data..." : "Uses backend AI endpoints"}
                </div>
              </div>

              <div className="mt-4">
                {isSubmitting ? (
                  <Loader label="Generating linked WBS, Gantt, and Risks..." />
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <FaFileLines className="text-cyan-300" />
                      Dynamic flow
                    </div>
                    <p className="mt-2 leading-7 text-slate-400">
                      The scope is sent to backend AI analysis, then dashboard views update from real generated data.
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
