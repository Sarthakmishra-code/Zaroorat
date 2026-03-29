import express from 'express';
const router = express.Router();
// import authcontroller from '../controllers/authController.js';
import { registerUser, loginUser, logoutUser, getCurrentUser, updateAccountDetails, sendOTP, verifyOTP } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
