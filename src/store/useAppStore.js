import { create } from "zustand";

export const useAppStore = create((set) => ({
  scope: "",
  activeTab: "wbs",

  project: {
    title: "ASA Project",
    status: "In Progress",
    tasks: 24,
    completion: 78,
    risks: 5,
    duration: "12 Weeks",
  },

  setScope: (value) => set({ scope: value }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));