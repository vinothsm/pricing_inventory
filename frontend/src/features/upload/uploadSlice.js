import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "./uploadService";

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  filesToUpload: [],
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {},
});

export const { reset } = uploadSlice.actions;
export default uploadSlice.reducer;
