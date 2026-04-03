import express from 'express';
const router = express.Router();
// import authcontroller from '../controllers/authController.js';
import { registerUser, verifyOTP, loginUser, googleLogin, logoutUser, getCurrentUser, updateAccountDetails, approveAdmin } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/logout', verifyJWT, logoutUser);
router.get('/approve-admin', approveAdmin);

router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
