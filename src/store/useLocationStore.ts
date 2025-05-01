import { create } from "zustand";
import {
  Country as AppCountry,
  City as AppCity,
  LocationState,
} from "../types/types";
import { Country, City, State, ICity } from "country-state-city";

export const useLocationStore = create<LocationState>((set, get) => ({
  locationType: "select",
  countries: [],
  cities: [],
  selectedCountry: null,
  selectedCity: null,
  isLoadingCountries: false,
  isLoadingCities: false,

  fetchCountries: async () => {
    set({ isLoadingCountries: true });

    try {
      // Get countries from the country-state-city package
      const allCountries = Country.getAllCountries();

      const countries = allCountries
        .map((country) => ({
          name: country.name,
          code: country.isoCode,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      set({
        countries,
        isLoadingCountries: false,
        selectedCountry: countries.length > 0 ? countries[0] : null,
      });

      // If we have a selected country, fetch its cities
      if (countries.length > 0) {
        get().fetchCities(countries[0].name);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
      set({ isLoadingCountries: false });
    }
  },

  fetchCities: async (countryName: string) => {
    set({ isLoadingCities: true });

    try {
      // First check for country in localStorage
      const storedCountryJson = localStorage.getItem("selectedCountry");
      let countryCode;
      
      if (storedCountryJson) {
        try {
          // Use the country from localStorage if available
          const storedCountry = JSON.parse(storedCountryJson);
          countryCode = storedCountry.code;
          
          // Ensure store state matches localStorage
          if (get().selectedCountry?.code !== storedCountry.code) {
            set({ selectedCountry: storedCountry });
            countryName = storedCountry.name;
          }
        } catch (e) {
          console.error("Error parsing stored country:", e);
        }
      }
      
      // Fallback to store state if localStorage didn't have valid data
      if (!countryCode) {
        countryCode = get().selectedCountry?.code;
      }
      
      // If still no country code, throw error
      if (!countryCode) {
        throw new Error("No country code available");
      }

      // Get cities for the selected country using the package
      const states = State.getStatesOfCountry(countryCode);
      let citiesList: ICity[] = [];

      // Get cities from all states in the country
      for (const state of states) {
        const stateCities = City.getCitiesOfState(countryCode, state.isoCode);
        citiesList = [...citiesList, ...stateCities];
      }

      // If no cities found through states, try direct country lookup
      if (citiesList.length === 0) {
        // Some countries don't have state data, so try getting cities directly
        const fallbackCities = getFallbackCities(countryName, countryCode);
        set({
          cities: fallbackCities as unknown as AppCity[],
          isLoadingCities: false,
        });
        return;
      }

      // Format the cities as expected by the application
      const cities = citiesList.map(
        (city) =>
          ({
            name: city.name,
            country: countryName,
            prototype: {}, // Add the required prototype property
          } as AppCity)
      );

      set({
        cities,
        isLoadingCities: false,
      });
    } catch (error) {
      console.error("Error loading cities:", error);
      // Use fallback
      const countryCode = get().selectedCountry?.code || "";
      const fallbackCities = getFallbackCities(countryName, countryCode);

      set({
        cities: fallbackCities as unknown as AppCity[],
        isLoadingCities: false,
      });
    }
  },

  setLocationType: (type) => {
    set({ locationType: type });

    // set location type in local storage
    localStorage.setItem("locationType", type);
  },

  setSelectedCountry: (country) => {
    set({ selectedCountry: country, selectedCity: null });
    get().fetchCities(country.name);

    // set selected country in local storage
    localStorage.setItem("selectedCountry", JSON.stringify(country));
  },

  setSelectedCity: (city) => {
    set({ selectedCity: city });

    // set selected city in local storage
    localStorage.setItem("selectedCity", JSON.stringify(city));
  },

  // Load selected country and city from local storage
  loadSelectedLocation: () => {
    const storedCountry = localStorage.getItem("selectedCountry");
    const storedCity = localStorage.getItem("selectedCity");

    if (storedCountry) {
      try {
        const country: AppCountry = JSON.parse(storedCountry);
        set({ selectedCountry: country });
        
        // Fetch cities for this country
        get().fetchCities(country.name);
      } catch (e) {
        console.error("Error parsing stored country:", e);
      }
    }

    if (storedCity) {
      try {
        const city = JSON.parse(storedCity);
        set({ selectedCity: city });
      } catch (e) {
        console.error("Error parsing stored city:", e);
      }
    }
  },

  clearSelectedLocation: () => {
    set({ selectedCountry: null, selectedCity: null });
    localStorage.removeItem("selectedCountry");
    localStorage.removeItem("selectedCity");
  },
}));

// Helper function to provide fallback cities for common countries
const getFallbackCities = (
  countryName: string,
  countryCode: string
): AppCity[] => {
  // Map of major cities by country code
  const fallbackCityMap: { [key: string]: string[] } = {
    US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    GB: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"],
    JP: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
    IN: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"],
    CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    BD: ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Kushtia"],
    PK: ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"],
    // Add more countries as needed
  };

  // Return cities for the specified country, or an empty array if none
  const cityNames = fallbackCityMap[countryCode] || [];
  return cityNames.map((name) => ({
    name,
    country: countryName,
    prototype: {}, // Add the required prototype property
  })) as AppCity[];
};
