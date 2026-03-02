import { asyncHandler } from "../utils/asyncHandler.js";
import { Bike } from "../models/Bike.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary} from "../utils/cloudinary.js";


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


const createBike = asyncHandler(async (req, res) => {
  const { bikeId, name, brand_name, model, description, engine_CC, kmRun, mileage, price, registrationNumber } =
    req.body;

  if (!bikeId || !name || !brand_name || !model || !engine_CC || !price) {
    throw new ApiError(400, "Please provide all required fields");
  }


  const bikeExists = await Bike.findOne({
    $or: [{ bikeId }, { registrationNumber }],
  });

  if (bikeExists) {
    throw new ApiError(409, "Bike with this ID or registration number already exists");
  }


  const uploadedImages = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) {
        uploadedImages.push({
          url: result.url,
          public_id: result.public_id,
        });
      }
    }
  }


  const bike = await Bike.create({
    bikeId,
    name,
    brand_name,
    model,
    description,
    engine_CC,
    kmRun: kmRun || 0,
    mileage,
    price,
    registrationNumber,
    images: uploadedImages,
  });

  return res.status(201).json(new ApiResponse(201, bike, "Bike created successfully"));
});



export{ getAllBikes, getBikeById, createBike}