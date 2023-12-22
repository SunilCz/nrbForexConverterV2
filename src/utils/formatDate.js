// src/utils/formatDate.js

const formatDate = (date) => {
  if (!date || !(date instanceof Date)) {
    // Handle the case when date is undefined or not a valid Date object
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default formatDate;
