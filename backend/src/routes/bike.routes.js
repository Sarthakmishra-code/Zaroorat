import { Router } from "express";
import { getAllBikes, getBikeById, createBike } from "../controllers/bike.controller.js";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/bikes").get(getAllBikes);
router.route("/bikes/:id").get(getBikeById);

router.route("/bikes/upload").post(verifyJWT, adminOnly, upload.array("images", 5), createBike);



export default router;