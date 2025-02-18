import { create } from "zustand";
import { PrayerTime } from "../types/types";

interface NextPrayerStore {
  nextPrayerTime: PrayerTime | null;
  setNextPrayerTime: (nextPrayerTime: PrayerTime | null) => void;
}

// zustand store for the next prayer get and set
const useNextPrayerStore = create<NextPrayerStore>((set) => ({
  nextPrayerTime: null,
  setNextPrayerTime: (nextPrayerTime: PrayerTime | null) =>
    set({ nextPrayerTime }),
}));

export default useNextPrayerStore;
