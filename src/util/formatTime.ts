// receive time in any format and return it in 12-hour format (e.g. 05:05 AM)
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const minute = parseInt(minutes);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${ampm}`;
};