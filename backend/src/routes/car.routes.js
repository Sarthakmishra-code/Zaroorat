import express from 'express';
import { addCar, deleteCar, getCars, getSingleCar } from '../controllers/car.controller.js';
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
    addCar
)

router.route("/").get(optionalAuth, getCars);


router.route('/:id').delete(
    verifyJWT,
    deleteCar
)

router.route("/:id").get(optionalAuth, getSingleCar);


export default router;