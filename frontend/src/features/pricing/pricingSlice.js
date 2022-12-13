import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pricingService from "./pricingService";

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  data: [],
  products: [],
  sizePerPage: 10,
  totalSize: 0,
};

export const getAllPricingRecords = createAsyncThunk(
  "pricing/get_all_pricing_records",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pricingService.getAllPricingRecords(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPricingRecords = createAsyncThunk(
  "pricing/get_pricing_records",
  async (pageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pricingService.getPricingRecords(pageData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const filterPricingRecords = createAsyncThunk(
  "pricing/filter_pricing_records",
  async (filterData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pricingService.filterPricingRecords(filterData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // .addCase(pricingRecords.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(pricingRecords.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.user = action.payload;
      // })
      // .addCase(pricingRecords.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload;
      //   state.user = null;
      // })
      .addCase(getPricingRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPricingRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = JSON.parse(action.payload.records);
        state.data = JSON.parse(action.payload.records).slice(0, 10);
        state.sizePerPage = 10;
        state.totalSize = action.payload.total_records;
      })
      .addCase(getPricingRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.products = null;
      })
      .addCase(getAllPricingRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPricingRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = JSON.parse(action.payload.records);
        state.data = JSON.parse(action.payload.records).slice(0, 10);
        state.sizePerPage = 10;
        state.totalSize = action.payload.total_records;
      })
      .addCase(getAllPricingRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.products = null;
      })
      .addCase(filterPricingRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(filterPricingRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = JSON.parse(action.payload.records);
        state.data = JSON.parse(action.payload.records).slice(0, 10);
        state.sizePerPage = 10;
        state.totalSize = action.payload.total_records;
      })
      .addCase(filterPricingRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.products = null;
      });
  },
});

export const { reset } = pricingSlice.actions;
export default pricingSlice.reducer;
