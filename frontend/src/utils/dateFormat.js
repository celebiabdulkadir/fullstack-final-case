export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    // Handle invalid date, maybe return null or a default value
    return null;
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }
  const parts = dateString.split("/");
  if (parts.length !== 3) {
    return null;
  }
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date)) {
    return null;
  }
  return date;
};

export const convertToStartOfDay = (dateString) => {
  if (!dateString) return null;

  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date)) return null;

  // Set the time to start of the day
  date.setHours(0, 0, 0, 0);

  return date;
};
