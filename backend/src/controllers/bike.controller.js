import { asyncHandler } from "../utils/asyncHandler.js";
import { Bike } from "../models/Bike.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";



const getAllBikes = asyncHandler(async (req, res) => {
  const { brand_name, availability, minPrice, maxPrice } = req.query;

  const query = {};

  if (brand_name) query.brand_name = brand_name;
  if (availability !== undefined) query.availability = availability === "true";

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const bikes = await Bike.find(query).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, bikes, "Bikes fetched successfully"));
});





const getBikeById = asyncHandler(async (req, res) => {
  const bike = await Bike.findById(req.params.id);

  if (!bike) {
    throw new ApiError(404, "Bike not found");
  }

  return res.status(200).json(new ApiResponse(200, bike, "Bike fetched successfully"));
});