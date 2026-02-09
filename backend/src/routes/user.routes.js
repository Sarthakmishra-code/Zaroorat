import express from 'express';
const router = express.Router();
// import authcontroller from '../controllers/authController.js';
import { registerUser, loginUser } from '../controllers/user.controller.js';


router.post('/register',registerUser );

router.post('/login', loginUser);

// module.exports= router;
export default router;
