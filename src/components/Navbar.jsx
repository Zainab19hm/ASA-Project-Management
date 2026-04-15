import { NavLink } from "react-router-dom";
import { FaCircleNodes } from "react-icons/fa6";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive
      ? "bg-white text-slate-950 shadow-lg shadow-cyan-500/20"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
            <FaCircleNodes className="text-lg" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300">ASA</p>
            <p className="text-xs text-slate-400">AI Scope Analyzer • localhost:3000</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Scope Input
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}