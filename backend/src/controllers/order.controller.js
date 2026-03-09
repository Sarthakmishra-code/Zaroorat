import { Order } from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { serviceType, serviceObjectId, serviceModel, price } = req.body;

    if (!serviceType || !serviceObjectId || !serviceModel || !price) {
        throw new ApiError(400, "All fields are required");
    }

    const order = await Order.create({
        user: req.user._id,
        serviceType,
        serviceObjectId,
        serviceModel,
        price
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
