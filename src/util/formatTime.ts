import dayjs from 'dayjs';

// Convert time string to 12-hour format (e.g. 05:05 AM)
export const formatTime = (date: dayjs.Dayjs) => {
  const dt = dayjs(date).format('YYYY-MM-DD');
  return (time: string): string => {
    // Parse the time string (assuming 24-hour format input)
    const parsedTime = dayjs(`${dt} ${time}`);

    // Format to 12-hour time with AM/PM
    return parsedTime.format('hh:mm A');
  };
}