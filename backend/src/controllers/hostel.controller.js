import {Hostel} from '../models/hostel.model.js'
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";

const getAllHostels = asyncHandler(async (req, res) => {
    const { name, roomCapacity, ac, availability, minPrice, maxPrice } = req.query;

    const query = {};

    if (name) {
        query.name = name
    };

    if (roomCapacity) {
        query.roomCapacity = roomCapacity
    };

    if (ac) {
        query.ac = ac
    };

    if (availability !== undefined) {
        query.availability = availability === "true"
    };

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const hostels = await Hostel.find(query).sort({ createdAt: -1 });

    return res
    .status(200)
    .json(
        new ApiResponse(200, hostels, "Hostels fetched successfully")
    );
});

const addHostel = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can add hostels");
    }

    const {
        hostelId, name, description, roomCapacity, ac, price, availability
    } = req.body;

    if (!hostelId || !name || !roomCapacity || !ac || !price) {
        throw new ApiError(400, "Required fields missing");
    }

    const existingHostel = await Hostel.findOne({ hostelId });

    if (existingHostel) {
        throw new ApiError(409, "Hostel already registered");
    }

    const HostelImageLocalPaths = req.files?.HostelImage?.map(file => file.path);

    if (!HostelImageLocalPaths || HostelImageLocalPaths.length === 0) {
        throw new ApiError(400, "Minimum one hostel image required");
    }

    const uploadedImages = await Promise.all(
        HostelImageLocalPaths.map(path => uploadOnCloudinary(path))
    );

    const images = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id
    }));

    const newCar = await Car.create({
        hostelId,
        name,
        description,
        roomCapacity,
        ac,
        price,
        availability,
        images
    });

    return res
    .status(201)
    .json(
        new ApiResponse(201, newCar, "New car added successfully")
    );
});

const deleteHostel = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can delete hostels");
    }

    const { hostelId } = req.params;

    const hostel = await Hostel.findOne({ hostelId });

    if (!hostel) {
        throw new ApiError(404, "Hostel not found");
    }

    const publicIds = hostel.images?.map(img => img.public_id) || [];

    if (publicIds.length > 0) {
        await deleteFromCloudinary(publicIds);
    }

    await Hostel.deleteOne({ hostelId });

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Hostel deleted successfully")
    );
});

export {
    getAllHostels,
    addHostel,
    deleteHostel
}