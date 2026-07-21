import { create } from "zustand";

export interface DemoSummary {
  date: string;
  totalAttended: number;
  passedCount: number;
  failedCount: number;
  successRate: string;
  passedCandidates: Record<string, any>[];
  failedCandidates: Record<string, any>[];
}

interface DemoStore {
  summary: DemoSummary | null;
  setSummary: (summary: DemoSummary) => void;
  clearSummary: () => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
  summary: null,

  setSummary: (summary) =>
    set({
      summary,
    }),

  clearSummary: () =>
    set({
      summary: null,
    }),
}));