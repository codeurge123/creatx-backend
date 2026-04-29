import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const ensureDatabaseConnected = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return next(
    new ApiError(
      503,
      "Database is currently unavailable. Please try again after MongoDB reconnects."
    )
  );
};
