import { useState, useEffect } from "preact/hooks";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PrayerCalendarProps {
  city?: string;
  country?: string;
  onDateSelect?: (date: Date) => void;
}

interface PrayerTimeData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
  };
  date: {
    readable: string;
    gregorian: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
      };
      year: string;
    };
    hijri: {
      date: string;
      month?: {
        en: string;
      };
      year?: string;
    };
  };
}

interface CalendarResponse {
  code: number;
  status: string;
  data: PrayerTimeData[];
}

const formatTime = (timeStr: string): string => {
  // Remove "(IST)" or similar timezone indicators that the API might include
  const cleanTime = timeStr.replace(/\s*\([^)]*\)/, "");

  // Convert 24-hour format (HH:MM) to 12-hour format (H:MM)
  const [hours, minutes] = cleanTime.split(":").map(Number);
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")}`;
};

const PrayerCalendar = ({
  city = "Tokyo",
  country = "Japan",
  onDateSelect,
}: PrayerCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // API uses 1-indexed months
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [prayerData, setPrayerData] = useState<PrayerTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = dayjs();

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use the correct method for Japan (2 = ISNA), adjust if needed
        // Using latitude and longitude can provide more accurate results
        const url = `https://api.aladhan.com/v1/calendarByCity/${currentYear}/${currentMonth}?city=${encodeURIComponent(
          city
        )}&country=${encodeURIComponent(country)}&method=2`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const responseData: CalendarResponse = await response.json();
        console.log("API Response:", responseData);

        if (
          responseData.code === 200 &&
          responseData.data &&
          Array.isArray(responseData.data)
        ) {
          setPrayerData(responseData.data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch prayer times"
        );
        // Set empty data to show N/A
        setPrayerData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [currentMonth, currentYear, city, country]);

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1]; // Adjust for 1-indexed months
  };

  const isToday = (date: string) => {
    // Check the actual format of the date string

    // Try parsing manually based on actual format
    let day, month, year;

    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Format is YYYY-MM-DD
      [year, month, day] = date.split("-").map(Number);
    } else if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // Format is DD-MM-YYYY
      [day, month, year] = date.split("-").map(Number);
    } else {
      console.error("Unknown date format:", date);
      return false;
    }

    const result =
      day === today.date() &&
      month === today.month() + 1 &&
      year === today.year();

    return result;
  };

  const formatDateCell = (date: PrayerTimeData["date"]) => {
    const monthAbbr = date.gregorian.month.en.substring(0, 3);
    return `${monthAbbr} ${date.gregorian.day}`;
  };

  // Generate calendar days based on the current month
  const getDummyCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const monthName = getMonthName(currentMonth).substring(0, 3);

    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: {
        readable: `${i + 1} ${monthName} ${currentYear}`,
        gregorian: {
          date: `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${(
            i + 1
          )
            .toString()
            .padStart(2, "0")}`,
          day: (i + 1).toString(),
          month: {
            number: currentMonth,
            en: getMonthName(currentMonth),
          },
          year: currentYear.toString(),
        },
        hijri: {
          date: `Unknown`,
        },
      },
      timings: {
        Fajr: "N/A",
        Sunrise: "N/A",
        Dhuhr: "N/A",
        Asr: "N/A",
        Maghrib: "N/A",
        Isha: "N/A",
      },
    }));
  };

  // Use actual data or fallback to dummy data
  const displayData =
    prayerData.length > 0 ? prayerData : getDummyCalendarDays();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading prayer times...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 text-black-primary">
          <FaChevronLeft />
        </button>

        {/* English month name and year here */}
        <div className="text-center">
          <h2 className="font-semibold text-black-primary text-sm mt-4">
            {getMonthName(currentMonth)} {currentYear}
          </h2>

          {/* hijri month name and year here */}
          <h4>
            {prayerData.length > 0 && prayerData[0].date.hijri && (
              <span className="text-[9px] font-medium text-gray-600">
                {prayerData[0].date.hijri.month?.en}{" "}
                {prayerData[0].date.hijri.year}
              </span>
            )}
          </h4>
        </div>

        <button onClick={nextMonth} className="p-2 text-black-primary">
          <FaChevronRight />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-primary rounded">
          Error: {error}. Using placeholder data instead.
        </div>
      )}

      <div className="overflow-x-auto border border-border-color rounded-lg">
        <table className="w-full border-collapse text-[9px]">
          <thead>
            <tr>
              <th className="border-b border-r border-border-color bg-blue-light text-[9px] text-black-secondary">
                Date
              </th>

              <th className="border-b border-r border-border-color bg-blue-secondary text-[9px] text-black-secondary">
                Fajr/
                <br />
                Sohhour
              </th>

              <th className="border-b border-r border-border-color bg-blue-light text-[9px] text-black-secondary">
                Sunrise
              </th>

              <th className="border-b border-r border-border-color bg-blue-secondary text-[9px] text-black-secondary">
                Dhuhr
              </th>

              <th className="border-b border-r border-border-color bg-blue-light text-[9px] text-black-secondary">
                Asr
              </th>

              <th className="border-b border-r border-border-color bg-blue-secondary text-[9px] text-black-secondary">
                Maghrib/
                <br />
                Iftar
              </th>

              <th className="border-b border-border-color bg-blue-light text-[9px] text-black-secondary">
                Isha
              </th>
            </tr>
          </thead>

          <tbody>
            {displayData.map((day) => {
              const isTodayRow = isToday(day.date.gregorian.date);

              return (
                <tr
                  key={day.date.gregorian.date}
                  className={`${isTodayRow ? "bg-red-50" : ""} 
                            hover:bg-gray-100 cursor-pointer`}
                  onClick={() =>
                    onDateSelect?.(new Date(day.date.gregorian.date))
                  }
                >
                  <td
                    className={`border-r border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-light`}
                  >
                    {formatDateCell(day.date)}
                  </td>

                  <td
                    className={`border-r border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-secondary`}
                  >
                    {day.timings.Fajr !== "N/A"
                      ? formatTime(day.timings.Fajr)
                      : "N/A"}
                  </td>
                  <td
                    className={`border-r border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-light`}
                  >
                    {day.timings.Sunrise !== "N/A"
                      ? formatTime(day.timings.Sunrise)
                      : "N/A"}
                  </td>
                  <td
                    className={`border-r border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-secondary`}
                  >
                    {day.timings.Dhuhr !== "N/A"
                      ? formatTime(day.timings.Dhuhr)
                      : "N/A"}
                  </td>
                  <td
                    className={`border-r border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-light`}
                  >
                    {day.timings.Asr !== "N/A"
                      ? formatTime(day.timings.Asr)
                      : "N/A"}
                  </td>
                  <td
                    className={`border-r border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-secondary`}
                  >
                    {day.timings.Maghrib !== "N/A"
                      ? formatTime(day.timings.Maghrib)
                      : "N/A"}
                  </td>
                  <td
                    className={`border-b border-border-color text-[9px] text-center ${
                      isTodayRow ? "text-red-primary" : "text-gray-800"
                    } bg-blue-light`}
                  >
                    {day.timings.Isha !== "N/A"
                      ? formatTime(day.timings.Isha)
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrayerCalendar;
