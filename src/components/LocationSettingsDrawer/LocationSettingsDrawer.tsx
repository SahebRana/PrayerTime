import { useEffect, useState } from "preact/hooks";
import { useLocationStore } from "../../store/useLocationStore";

interface LocationSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSettingsDrawer = ({
  isOpen,
  onClose,
}: LocationSettingsDrawerProps) => {
  const {
    locationType,
    countries,
    cities,
    selectedCountry,
    selectedCity,
    isLoadingCountries,
    isLoadingCities,
    isDetectingLocation,
    fetchCountries,
    fetchCities,
    setLocationType,
    setSelectedCountry,
    setSelectedCity,
    getLocationType,
    detectLocation,
    requestLocationAccess,
  } = useLocationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load from localStorage on component mount (only once)
  useEffect(() => {
    const country = localStorage.getItem("selectedCountry");
    const city = localStorage.getItem("selectedCity");

    if (country) {
      try {
        const parsedCountry = JSON.parse(country);
        if (parsedCountry && parsedCountry.code) {
          // Only set if not already set or different
          if (!selectedCountry || selectedCountry.code !== parsedCountry.code) {
            setSelectedCountry(parsedCountry);
          }
        }
      } catch (e) {
        console.error("Error parsing country:", e);
      }
    }

    if (city) {
      try {
        const parsedCity = JSON.parse(city);
        if (parsedCity && parsedCity.name) {
          setSearchTerm(parsedCity.name);
          setSelectedCity(parsedCity);
        }
      } catch (e) {
        console.error("Error parsing city:", e);
      }
    }

    // Mark initial load as complete after a short delay
    setTimeout(() => setIsInitialLoad(false), 100);
  }, []); // Keep empty dependency array

  useEffect(() => {
    getLocationType();
  }, [getLocationType]);

  useEffect(() => {
    if (isOpen) {
      fetchCountries();

      // Reload saved selections when drawer opens
      // const country = localStorage.getItem("selectedCountry");
      const city = localStorage.getItem("selectedCity");

      if (city) {
        try {
          const parsedCity = JSON.parse(city);
          if (parsedCity && parsedCity.name) {
            setSearchTerm(parsedCity.name);
          }
        } catch (e) {
          console.error("Error parsing city:", e);
        }
      }
    }
  }, [isOpen, fetchCountries]);

  useEffect(() => {
    if (searchTerm && cities.length > 0) {
      setFilteredCities(
        cities.filter((city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities);
    }
  }, [searchTerm, cities]);

  useEffect(() => {
    // Fetch cities when selectedCountry changes
    if (selectedCountry && !isInitialLoad) {
      fetchCities(selectedCountry.name);
    }
  }, [selectedCountry?.code, fetchCities, isInitialLoad]); // Use selectedCountry.code instead of selectedCountry

  if (!isOpen) return null;

  const clearCity = () => {
    setSelectedCity(null as any);
    setSearchTerm("");
    localStorage.removeItem("selectedCity");
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#00000066] z-[1999]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[2000] transition-all duration-300 ease-in-out ${isOpen ? "w-80" : "w-0 opacity-0"
          }`}
      >
        <div className="h-full bg-primary w-80 overflow-hidden flex flex-col">
          <div className="p-4 bg-primary flex items-center border-b border-border-color">
            <button onClick={onClose} className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold">Settings</h2>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <h3 className="font-medium mb-2">Location Type</h3>

            <div className="mb-4">
              {locationError && (
                <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {locationError}
                </div>
              )}
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="auto"
                  name="locationType"
                  className="mr-2 accent-black-primary"
                  checked={locationType === "auto"}
                  onChange={async () => {
                    setLocationError(null);
                    setLocationType("auto");
                    try {
                      await detectLocation();
                      localStorage.setItem("locationType", "auto");
                    } catch (error) {
                      setLocationError("Failed to detect location automatically. Please try manual selection.");
                    }
                  }}
                />
                <label htmlFor="auto" className="flex items-center">
                  Auto
                  {isDetectingLocation && locationType === "auto" && (
                    <span className="ml-2 text-xs text-gray-500">Detecting...</span>
                  )}
                </label>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="giveAccess"
                  name="locationType"
                  className="mr-2 accent-black-primary"
                  checked={locationType === "giveAccess"}
                  onChange={async () => {
                    setLocationError(null);
                    setLocationType("giveAccess");
                    try {
                      await requestLocationAccess();
                    } catch (error) {
                      setLocationError((error as Error).message || "Failed to access location. Please check permissions or use manual selection.");
                    }
                  }}
                />
                <label htmlFor="giveAccess" className="flex items-center">
                  Give Location Access
                  {isDetectingLocation && locationType === "giveAccess" && (
                    <span className="ml-2 text-xs text-gray-500">Requesting...</span>
                  )}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="select"
                  name="locationType"
                  className="mr-2 accent-black-primary"
                  checked={locationType === "select"}
                  onChange={() => setLocationType("select")}
                />
                <label htmlFor="select">Select Location</label>
              </div>
            </div>

            {locationType === "select" && (
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black-secondary">
                    Country
                  </label>

                  <div className="relative">
                    {isLoadingCountries ? (
                      <div className="w-full p-2 border rounded bg-gray-50">
                        Loading countries...
                      </div>
                    ) : (
                      <select
                        className="w-full px-2 border-black-secondary border rounded-lg pr-8 appearance-none bg-primary"
                        value={selectedCountry?.name || ""}
                        onChange={(e) => {
                          const country = countries.find(
                            (c) => c.name === e.currentTarget.value
                          );
                          if (country) {
                            setSelectedCountry(country);
                          }
                        }}
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black-secondary">
                    City
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-2 border rounded-lg border-black-secondary pr-8"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.currentTarget.value);
                        if (e.currentTarget.value === "") {
                          clearCity();
                        }
                      }}
                      placeholder="Search for a city..."
                    />

                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-8 flex items-center pr-2"
                        onClick={() => {
                          clearCity();
                        }}
                      >
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* City dropdown - hide after selection */}
                  {isLoadingCities ? (
                    <div className="mt-1 p-2 border rounded bg-gray-50">
                      Loading cities...
                    </div>
                  ) : (
                    searchTerm &&
                    filteredCities.length > 0 &&
                    searchTerm !== selectedCity?.name && (
                      <div className="mt-1 border rounded max-h-48 overflow-y-auto bg-white">
                        {filteredCities.map((city) => (
                          <div
                            key={city.name}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedCity(city);
                              setSearchTerm(city.name);
                            }}
                          >
                            {city.name}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
