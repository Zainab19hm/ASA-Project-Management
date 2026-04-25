import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaArrowRight,
  FaCircleCheck,
  FaChartLine,
  FaShieldHalved,
  FaCode,
} from "react-icons/fa6";
import { useAppStore } from "../store/useAppStore";

export default function Home() {
  const navigate = useNavigate();
  const setScope = useAppStore((s) => s.setScope);

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const minChars = 200;
  const progress = Math.min((text.length / minChars) * 100, 100);

  const handleSubmit = () => {
    if (text.trim().length < minChars) {
      setError(`Scope must be at least ${minChars} characters.`);
      return;
    }

    setError("");
    setScope(text);
    navigate("/dashboard");
  };

  const features = [
    {
      icon: <FaChartLine />,
      title: "Smart Planning",
      desc: "Generate professional structure for tasks, timeline and project flow.",
    },
    {
      icon: <FaShieldHalved />,
      title: "Risk Analysis",
      desc: "Track risks early with clean visual dashboards and metrics.",
    },
    {
      icon: <FaCode />,
      title: "Modern Workflow",
      desc: "Built with React ecosystem, scalable UI and premium UX.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_35%)]" />

      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-cyan-400 blur-3xl animate-pulse" />
        <div className="absolute right-10 top-40 h-52 w-52 rounded-full bg-violet-500 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/3 h-44 w-44 rounded-full bg-blue-500 blur-3xl animate-pulse" />
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <FaRocket />
            Advanced Project Management Platform
          </div>

          <h1 className="mt-6 text-5xl font-black leading-tight sm:text-6xl">
            Build Smarter With{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-500 bg-clip-text text-transparent">
              ASA Project
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Transform raw project scope into structured outputs: WBS, Gantt
            Chart, Risk Analysis, and Smart Q&A Assistant — all inside one
            premium dashboard.
          </p>

          {/* Feature Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <div className="mb-3 w-fit rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  {item.icon}
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Project Scope Input
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Describe Your Project
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Enter a detailed project scope (minimum 200 characters) to generate
            intelligent planning outputs.
          </p>

          <textarea
            rows="9"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Build a web-based e-commerce platform with admin dashboard, customer portal, payment gateway, analytics, product management..."
            className="mt-5 w-full rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm outline-none transition focus:border-cyan-400"
          />

          {/* Counter */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {text.length} / {minChars} characters
            </span>

            {text.length >= minChars && (
              <span className="flex items-center gap-2 text-emerald-400">
<FaCircleCheck />                Ready
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 font-bold text-slate-950 transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Generate Dashboard
            <FaArrowRight />
          </button>
        </motion.div>
      </section>
    </main>
  );
}