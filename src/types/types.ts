import { UseFormRegister } from "react-hook-form";
import { Dayjs } from "dayjs";

export interface IPrayerCardProps {
  prayer: PrayerTime;
  register: UseFormRegister<PrayerFormData>;
  completedPrayers: string[];
  notifications: string[];
}

export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  completed: boolean;
  notificationEnabled: boolean;
  datetime?: Dayjs;
}

export interface PrayerFormData {
  completedPrayers: string[];
  notifications: string[];
}