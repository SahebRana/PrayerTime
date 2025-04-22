import { create } from "zustand";

interface HeaderStore {
  // Define the properties and methods you want to manage in the header store
  // For example, you might want to manage the title or visibility of the header
  title: string;
  setTitle: (title: string) => void;
  isVisible: boolean;
  setVisibility: (isVisible: boolean) => void;
  // for calender and day icon toggle
  isCalender: boolean;
  setCalender: (isCalender: boolean) => void;
}

const useHeaderStore = create<HeaderStore>((set) => ({
  title: "Default Title",
  setTitle: (title: string) => set({ title }),

  isVisible: true,
  setVisibility: (isVisible: boolean) => set({ isVisible }),

  // for calender and day icon toggle
  isCalender: false,
  setCalender: (isCalender) => set({ isCalender: isCalender }),
}));

export default useHeaderStore;
