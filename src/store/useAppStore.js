import { create } from "zustand";

const initialProject = {
  title: "AI Scope Analysis",
  subtitle: "Waiting for project scope input",
  scope: "",
  progress: 0,
  tasksCount: 0,
  risksCount: 0,
  duration: "0 days",
  confidence: 0,
  wbs: [],
  ganttTasks: [],
  ganttRawTasks: [],
  risks: [],
  raw: {
    wbs: null,
    gantt: null,
    risk: null,
  },
};

export const useAppStore = create((set) => ({
  scope: "",
  activeTab: "wbs",
  isLoading: false,
  error: "",
  project: initialProject,

  setScope: (scope) => set({ scope }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProject: (project) => set({ project }),
  resetProject: () => set({ project: initialProject, error: "", activeTab: "wbs" }),
}));
