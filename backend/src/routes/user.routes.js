import express from 'express';
const router = express.Router();
// import authcontroller from '../controllers/authController.js';
import { registerUser, loginUser, logoutUser} from '../controllers/user.controller.js';


router.post('/register',registerUser );

router.post('/login', loginUser);
router.post('/logout', logoutUser);

// module.exports= router;
export default router;
