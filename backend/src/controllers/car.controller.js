import {Car} from '../models/car.model.js'
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const addCar = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can add cars");
    }

    const {
        name, description, brand, model,
        seatingCapacity, mileage, kmRun,
        price, registrationNumber, availability
    } = req.body;

    if (!name || !brand || !model || !price || !registrationNumber) {
        throw new ApiError(400, "Required fields missing");
    }

    const existingCar = await Car.findOne({ registrationNumber });

    if (existingCar) {
        throw new ApiError(409, "Car already registered");
    }

    const CarImageLocalPaths = req.files?.CarImage?.map(file => file.path);

    if (!CarImageLocalPaths || CarImageLocalPaths.length === 0) {
        throw new ApiError(400, "Minimum one car image required");
    }

    const uploadedImages = await Promise.all(
        CarImageLocalPaths.map(path => uploadOnCloudinary(path))
    );

    const images = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id
    }));

    const newCar = await Car.create({
        name,
        description,
        brand,
        model,
        seatingCapacity,
        mileage,
        kmRun,
        price,
        registrationNumber,
        availability,
        images
    });

    return res.status(201).json(
        new ApiResponse(201, newCar, "New car added successfully")
    );
});

const deleteCar = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can delete cars");
    }

    const { registrationNumber } = req.params;

    const car = await Car.findOne({ registrationNumber });

    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    const publicIds = car.images?.map(img => img.public_id) || [];

    if (publicIds.length > 0) {
        await deleteFromCloudinary(publicIds);
    }

    await Car.deleteOne({ registrationNumber });

    return res.status(200).json(
        new ApiResponse(200, null, "Car deleted successfully")
    );
});




export{
    addCar,
    deleteCar
}