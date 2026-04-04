import { Order } from "../models/order.model.js";
import { Car } from "../models/car.model.js";
import { Bike } from "../models/bike.model.js";
import { Hostel } from "../models/hostel.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { serviceType, serviceObjectId, serviceModel, price, rentalType } = req.body;

    if (!serviceType || !serviceObjectId || !serviceModel || !price) {
        throw new ApiError(400, "All fields are required");
    }

    let updatedService;
    if (serviceModel === "Car") {
        updatedService = await Car.findOneAndUpdate({ _id: serviceObjectId, availability: true }, { availability: false });
    } else if (serviceModel === "Bike") {
        updatedService = await Bike.findOneAndUpdate({ _id: serviceObjectId, availability: true }, { availability: false });
    } else if (serviceModel === "Hostel") {
        updatedService = await Hostel.findOneAndUpdate({ _id: serviceObjectId, availability: true }, { availability: false });
    } else {
        throw new ApiError(400, "Invalid service model");
    }

    if (!updatedService) {
        throw new ApiError(400, "Service is not available or not found");
    }

    const order = await Order.create({
        user: req.user._id,
        serviceType,
        serviceObjectId,
        serviceModel,
        price,
        rentalType: rentalType || "day"
    });

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order placed successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("serviceObjectId")
        .sort("-createdAt");

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    if (!req.user.admin) {
        throw new ApiError(403, "Access denied. Admins only.");
    }

    const orders = await Order.find()
        .populate("user", "fullname email username")
        .populate("serviceObjectId")
        .sort("-createdAt");

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

export {
    createOrder,
    getUserOrders,
    getAllOrders
};
