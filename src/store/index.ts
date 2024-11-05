import { create } from "zustand";
import { Editor } from "tldraw";

export const useKreateStore = create((set) => ({
  tldrawEditor: null,
  setTldrawEditor: (tldrawEditor: Editor) => set({ tldrawEditor }),
  // bears: 0,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}));
