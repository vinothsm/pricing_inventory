import axios from "axios";

const API_URL = "http://localhost:8200/pricing/";

// get pricing records
const getPricingRecords = async (pageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const respone = await axios.get(
    API_URL +
      `pricing_records?_start=${pageData._start}&_limit=${pageData._limit}`,
    config
  );
  return respone.data;
};

const getAllPricingRecords = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const respone = await axios.get(
    API_URL + `pricing_records?_start=0&_limit=50`,
    config
  );
  return respone.data;
};

const filterPricingRecords = async (pageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const respone = await axios.get(
    API_URL + `filter_pricing_records?${pageData}`,
    config
  );
  return respone.data;
};

const pricingService = {
  getPricingRecords,
  getAllPricingRecords,
  filterPricingRecords,
};

export default pricingService;
