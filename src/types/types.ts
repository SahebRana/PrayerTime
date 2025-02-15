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