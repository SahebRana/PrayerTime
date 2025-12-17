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
  selectedCity: City | null;
  isLoadingCountries: boolean;
  isLoadingCities: boolean;
  isDetectingLocation: boolean;
  fetchCountries: () => Promise<void>;
  fetchCities: (countryName: string) => Promise<void>;
  setLocationType: (type: LocationType) => void;
  getLocationType: () => void;
  setSelectedCountry: (country: Country) => void;
  setSelectedCity: (city: City) => void;
  loadSelectedLocation: () => void;
  detectLocation: () => Promise<{ city: string, country: string }>;
  requestLocationAccess: () => Promise<{ latitude?: number, longitude?: number, city?: string, country?: string }>;
}
