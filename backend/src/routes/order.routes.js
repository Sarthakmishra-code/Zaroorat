import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT); // All order routes require authentication

router.route("/")
    .post(createOrder)
    .get(getUserOrders);

router.route("/admin/all-orders").get(getAllOrders);

export default router;
