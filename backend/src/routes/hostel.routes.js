import express from 'express';
import { getAllHostels, addHostel, deleteHostel } from '../controllers/hostel.controller.js';
import { verifyJWT, optionalAuth } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();


router.route('/').post(
    verifyJWT,
    upload.fields([
        {
            name: "HostelImage",
            maxCount: 10
        }
    ]),
    addHostel
)

router.route("/").get(optionalAuth, getAllHostels);


router.route('/:hostelId').delete(
    verifyJWT,
    deleteHostel
)

export default router;
