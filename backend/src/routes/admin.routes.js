import express from 'express';
import {
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
} from '../controllers/admin.controller.js';
import { verifyJWT, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT, adminOnly); // Protect all routes in this file

// Order Management
router.route("/orders").get(getAllOrders);
router.route("/orders/:id").get(getOrderById).patch(updateOrderStatus).delete(deleteOrder);

// User Management
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserById).patch(updateUserStatus).delete(deleteUser);

// Service Management
router.route("/services").get(getAllServices);

// Review Management
router.route("/reviews").get(getAllReviews);
router.route("/reviews/:id").delete(deleteReview);

// Settings Management
router.route("/settings").get(getSettings).patch(updateSettings);

// Dashboard & Logs
router.route("/stats").get(getDashboardStats);
router.route("/logs").get(getAdminLogs);

export default router;
