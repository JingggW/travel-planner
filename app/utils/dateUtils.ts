export const formatDate = (date: string) => {
  // Convert date string to YYYY-MM-DD format for input type="date"
  return new Date(date).toISOString().split("T")[0];
};

export const formatDisplayDate = (date: string) => {
  // Convert date string to "Month D, YYYY" format for display
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
