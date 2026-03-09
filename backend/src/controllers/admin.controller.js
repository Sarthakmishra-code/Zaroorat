import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Car } from "../models/car.model.js";
import { Bike } from "../models/bike.model.js";
import { Hostel } from "../models/hostel.model.js";
import { AdminLog } from "../models/AdminLog.model.js";
import { Settings } from "../models/Settings.model.js";
// import { Review } from "../models/reviews.model.js";
import { Comment } from "../models/reviews.model.js";

import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ===== HELPER FUNCTION =====
const logAdminAction = async (adminId, action, details) => {
    try {
        await AdminLog.create({
            adminId,
            action,
            details,
        });
    } catch (error) {
        console.error('Error logging admin action:', error);
    }
};

// ============================================
// ORDER MANAGEMENT
// ============================================

const getAllOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
        .populate("user", "fullname email username")
        .populate("serviceObjectId")
        .sort("-createdAt")
        .skip(parseInt(skip))
        .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total
            }
        }, "Orders fetched successfully")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "fullname email username phone address")
        .populate("serviceObjectId");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    await logAdminAction(req.user._id, 'ORDER_STATUS_CHANGED', { orderId: id, newStatus: status });

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    await logAdminAction(req.user._id, 'ORDER_DELETED', { orderId: id });

    return res.status(200).json(
        new ApiResponse(200, null, "Order deleted successfully")
    );
});

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
        query.$or = [
            { fullname: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { username: new RegExp(search, 'i') }
        ];
    }

    const users = await User.find(query)
        .select("-password -refreshToken")
        .sort("-createdAt")
        .skip(parseInt(skip))
        .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total
            }
        }, "Users fetched successfully")
    );
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;

    const user = await User.findByIdAndUpdate(id, { admin }, { new: true }).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await logAdminAction(req.user._id, 'USER_ADMIN_STATUS_UPDATED', { targetUserId: id, isAdmin: admin });

    return res.status(200).json(
        new ApiResponse(200, user, "User status updated successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await logAdminAction(req.user._id, 'USER_DELETED', { targetUserId: id });

    return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});

// ============================================
// SERVICE MANAGEMENT (Cars, Bikes, Hostels)
// ============================================

const getAllServices = asyncHandler(async (req, res) => {
    const cars = await Car.find();
    const bikes = await Bike.find();
    const hostels = await Hostel.find();

    return res.status(200).json(
        new ApiResponse(200, {
            cars,
            bikes,
            hostels
        }, "All services fetched successfully")
    );
});

// ============================================
// REVIEWS MANAGEMENT
// ============================================

const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Comment.find()
        .populate("user", "fullname email")
        .sort("-createdAt");

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Comment.findByIdAndDelete(id);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    await logAdminAction(req.user._id, 'REVIEW_DELETED', { reviewId: id });

    return res.status(200).json(
        new ApiResponse(200, null, "Review deleted successfully")
    );
});

// ============================================
// SETTINGS MANAGEMENT
// ============================================

const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    return res.status(200).json(
        new ApiResponse(200, settings, "Settings fetched successfully")
    );
});

const updateSettings = asyncHandler(async (req, res) => {
    const updates = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create(updates);
    } else {
        settings = await Settings.findByIdAndUpdate(settings._id, updates, { new: true });
    }

    await logAdminAction(req.user._id, 'SETTINGS_UPDATED', updates);

    return res.status(200).json(
        new ApiResponse(200, settings, "Settings updated successfully")
    );
});

// ============================================
// DASHBOARD & ANALYTICS
// ============================================

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalBikes = await Bike.countDocuments();
    const totalHostels = await Hostel.countDocuments();

    const revenueResult = await Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
    ]);

    const recentOrders = await Order.find()
        .populate("user", "fullname")
        .sort("-createdAt")
        .limit(5);

    return res.status(200).json(
        new ApiResponse(200, {
            stats: {
                totalUsers,
                totalOrders,
                totalServices: totalCars + totalBikes + totalHostels,
                totalRevenue: revenueResult[0]?.totalRevenue || 0,
            },
            recentOrders
        }, "Dashboard stats fetched successfully")
    );
});

const getAdminLogs = asyncHandler(async (req, res) => {
    const logs = await AdminLog.find().populate("adminId", "fullname email").sort("-createdAt").limit(50);
    return res.status(200).json(new ApiResponse(200, logs, "Admin logs fetched successfully"));
});

export {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
    getAllServices,
    getAllReviews,
    deleteReview,
    getSettings,
    updateSettings,
    getDashboardStats,
    getAdminLogs
};
