import express from 'express';
import { addCar, deleteCar } from '../controllers/car.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();


router.route('/cars').post(
    verifyJWT,
    upload.fields([
        {
            name: "CarImage",
            maxCount: 10
        }
    ]),
    addCar
)

router.route('/cars').delete(
    verifyJWT,
    deleteCar
)

export default router;