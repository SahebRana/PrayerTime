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

export interface Country {
  name: string;
  code: string;
}

export interface City {
  name: string;
  country: string;
  prototype: string;
}

export type LocationType = "auto" | "giveAccess" | "select";

export interface LocationState {
  locationType: LocationType;
  countries: Country[];
  cities: City[];
  selectedCountry: Country | null;
  selectedCity: string | null;
  isLoadingCountries: boolean;
  isLoadingCities: boolean;
  fetchCountries: () => Promise<void>;
  fetchCities: (countryName: string) => Promise<void>;
  setLocationType: (type: LocationType) => void;
  getLocationType: () => LocationType;
  setSelectedCountry: (country: Country) => void;
  setSelectedCity: (city: string) => void;
}
