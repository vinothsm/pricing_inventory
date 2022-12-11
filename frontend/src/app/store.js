import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import pricingReducer from "../features/pricing/pricingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pricing: pricingReducer,
  },
});
