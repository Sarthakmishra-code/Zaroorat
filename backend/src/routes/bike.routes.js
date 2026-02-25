import express from 'express';
import { addBike, deleteBike, getBikes, getSingleBike } from '../controllers/bike.controller.js';
import {verifyJWT, optionalAuth} from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();


router.route('/').post(
    verifyJWT,
    upload.fields([
        {
            name: "CarImage",
            maxCount: 10
        }
    ]),
    addBike
)

router.route("/").get(optionalAuth, getBikes);


router.route('/:id').delete(
    verifyJWT,
    deleteBike
)

router.route("/:id").get(optionalAuth, getSingleBike);


export default router;