// src/api/forexApi.js
import formatDate from "../utils/formatDate";

const API_URL = 'https://www.nrb.org.np/api/forex/v1/rates';

const forexApi = {
  getForexData: async (fromDate, toDate) => {
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const response = await fetch(
      `${API_URL}?page=1&per_page=100&from=${formattedFromDate}&to=${formattedToDate}`
    );

    const data = await response.json();
    return data.data.payload;
  },
};

export default forexApi;
