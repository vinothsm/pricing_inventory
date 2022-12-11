import axios from "axios";

const API_URL = "http://localhost:8200/pricing/";

// Register a new user
const getPricingRecords = async (pageData, token) => {
  const respone = await axios.get(
    API_URL +
      `pricing_records?_start=${pageData._start}&_limit=${pageData._limit}`
  );
  return respone.data;
};

const getAllPricingRecords = async (token) => {
  const respone = await axios.get(
    API_URL + `pricing_records?_start=1&_limit=50`
  );
  return respone.data;
};

const pricingService = {
  getPricingRecords,
  getAllPricingRecords,
};

export default pricingService;
