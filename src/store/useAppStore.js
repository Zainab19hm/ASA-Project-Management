import { create } from "zustand";
import { mockProject } from "../data/mockProject";

export const useAppStore = create((set) => ({
  scope: "",
  activeTab: "wbs",
  isLoading: false,
  project: mockProject,

  setScope: (scope) => set({ scope }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLoading: (isLoading) => set({ isLoading }),
  setProject: (project) => set({ project }),
}));