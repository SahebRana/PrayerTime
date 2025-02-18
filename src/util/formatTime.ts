import dayjs from 'dayjs';

// Convert time string to 12-hour format (e.g. 05:05 AM)
export const formatTime = (time: string): string => {
  // Parse the time string (assuming 24-hour format input)
  const parsedTime = dayjs(`2024-01-01 ${time}`);
  
  // Format to 12-hour time with AM/PM
  return parsedTime.format('h:mm A');
};