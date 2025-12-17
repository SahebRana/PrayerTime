import { create } from "zustand";
import {
  Country as AppCountry,
  City as AppCity,
  LocationState,
  LocationType,
} from "../types/types";
import { Country, City, State, ICity } from "country-state-city";

export const useLocationStore = create<LocationState>((set, get) => ({
  locationType: "auto",
  countries: [],
  cities: [],
  selectedCountry: null,
  selectedCity: null,
  isLoadingCountries: false,
  isLoadingCities: false,
  isDetectingLocation: false,

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

  getLocationType: () => {
    const storedType = localStorage.getItem("locationType");
    if (storedType) {
      set({ locationType: storedType as LocationType });
    }
  },

  setSelectedCountry: (country) => {
    const currentCity = get().selectedCity;

    // Only clear city if the country actually changed
    const isCountryChanged = get().selectedCountry?.code !== country.code;

    set({
      selectedCountry: country,
      selectedCity: isCountryChanged ? null : currentCity
    });

    // Only fetch cities and clear localStorage if country changed
    if (isCountryChanged) {
      get().fetchCities(country.name);
      localStorage.removeItem("selectedCity");
    }

    // Always save the selected country
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    localStorage.setItem("country", country.code);
  },

  setSelectedCity: (city) => {
    set({ selectedCity: city });

    // Save to localStorage
    if (city && city.name) {
      localStorage.setItem("selectedCity", JSON.stringify(city));
      localStorage.setItem("city", city.name);
    } else {
      // localStorage.removeItem("selectedCity");
    }
  },

  // Load selected country and city from local storage
  loadSelectedLocation: () => {
    const storedCountry = localStorage.getItem("selectedCountry");
    const storedCity = localStorage.getItem("selectedCity");

    if (storedCountry) {
      try {
        const country: AppCountry = JSON.parse(storedCountry);
        set({ selectedCountry: country });
        // Also fetch cities for this country
        get().fetchCities(country.name);
      } catch (e) {
        console.error("Failed to parse stored country", e);
      }
    }

    if (storedCity) {
      try {
        const city: AppCity = JSON.parse(storedCity); // Ensure it's parsed as AppCity type
        // Only set the city if it's a valid object with required properties
        if (city && typeof city === 'object' && city.name) {
          set({ selectedCity: city });
        }
      } catch (e) {
        console.error("Failed to parse stored city", e);
      }
    }
  },

  clearSelectedLocation: () => {
    set({ selectedCountry: null, selectedCity: null });
    localStorage.removeItem("selectedCountry");
    localStorage.removeItem("selectedCity");
  },

  detectLocation: async () => {
    set({ isDetectingLocation: true });

    // Multiple IP geolocation services with fallbacks
    const geolocationServices = [
      {
        name: 'ipinfo.io',
        url: 'https://ipinfo.io/json',
        parseResponse: (data: any) => ({
          city: data.city,
          country_name: data.country,
          country_code: data.country
        })
      },
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parseResponse: (data: any) => ({
          city: data.city,
          country_name: data.country_name,
          country_code: data.country_code || data.country
        })
      },
      {
        name: 'ip-api.com',
        url: 'http://ip-api.com/json/',
        parseResponse: (data: any) => ({
          city: data.city,
          country_name: data.country,
          country_code: data.countryCode
        })
      }
    ];

    for (const service of geolocationServices) {
      try {
        const response = await fetch(service.url);

        if (!response.ok) {
          // throw new Error(`HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        const locationData = service.parseResponse(data);

        if (locationData.city && locationData.country_name) {
          const autoCountry = {
            name: locationData.country_name,
            code: locationData.country_code || locationData.country_name.substring(0, 2).toUpperCase()
          };
          const autoCity = {
            name: locationData.city,
            country: locationData.country_name,
            prototype: ""
          };

          set({
            selectedCountry: autoCountry,
            selectedCity: autoCity,
            isDetectingLocation: false
          });

          localStorage.setItem("selectedCountry", JSON.stringify(autoCountry));
          localStorage.setItem("selectedCity", JSON.stringify(autoCity));

          localStorage.setItem("city", autoCity.name);
          localStorage.setItem("country", autoCountry.code);

          return {
            city: autoCity.name,
            country: autoCountry.code
          };
        }
      } catch (error) {
        console.warn(`Failed to get location from ${service.name}:`, error);
        continue;
      }
    }

    // If all services failed
    set({ isDetectingLocation: false });
    throw new Error("Unable to detect location from any IP geolocation service");
  },

  requestLocationAccess: async () => {
    set({ isDetectingLocation: true });

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        set({ isDetectingLocation: false });
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            if (data.city && data.countryName) {
              const geoCountry = { name: data.countryName, code: data.countryCode || "" };
              const geoCity = { name: data.city, country: data.countryName, prototype: "" };

              set({
                selectedCountry: geoCountry,
                selectedCity: geoCity,
                isDetectingLocation: false
              });

              localStorage.setItem("selectedCountry", JSON.stringify(geoCountry));
              localStorage.setItem("selectedCity", JSON.stringify(geoCity));
              localStorage.setItem("city", geoCity.name);
              localStorage.setItem("country", geoCountry.code);
              localStorage.setItem("locationType", "giveAccess");
              localStorage.setItem("latitude", latitude.toString());
              localStorage.setItem("longitude", longitude.toString());


              resolve({ latitude, longitude, city: geoCity.name, country: geoCountry.code });
            } else {
              throw new Error("Unable to get location name");
            }
          } catch (error) {
            console.error("Error with reverse geocoding:", error);
            set({ isDetectingLocation: false });
            reject(error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          set({ isDetectingLocation: false });

          // Create user-friendly error message based on error code
          let userMessage = "Unable to access location";
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              userMessage = "Location access was denied. Please enable location permissions in your browser settings.";
              break;
            case 2: // POSITION_UNAVAILABLE
              userMessage = "Location information is unavailable. Please check your internet connection.";
              break;
            case 3: // TIMEOUT
              userMessage = "Location request timed out. Please try again.";
              break;
            default:
              userMessage = `Location access failed: ${error.message}`;
          }

          const enhancedError = new Error(userMessage) as Error & { code: number };
          enhancedError.code = error.code;
          reject(enhancedError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
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
