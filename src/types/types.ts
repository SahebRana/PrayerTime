import { UseFormRegister } from "react-hook-form";

export interface IPrayerCardProps {
  prayer: {
    name: string;
    time: string;
  };
  register: UseFormRegister<any>;
    completedPrayers: string[];
    notifications: string[];
}

export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  completed: boolean;
  notificationEnabled: boolean;
}

export interface PrayerFormData {
  completedPrayers: string[];
  notifications: string[];
}