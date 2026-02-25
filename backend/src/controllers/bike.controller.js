import { asyncHandler } from "../utils/asyncHandler.js";
import { Bike } from "../models/bike.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";



const getBikes = asyncHandler(async (req, res) => {
    const {
        search,
        brand,
        model,
        category,
        minPrice,
        maxPrice,
        city
    } = req.query;

    const query = { availability: true };

    if (search) {
        const lowerSearch = search.toLowerCase();

        if (lowerSearch.includes("commuter")) {
            query.category = "Commuter"
        };

        if (lowerSearch.includes("Sport")) {
            query.category = "Sport"
        };

        if (lowerSearch.includes("Cruiser")) {
            query.category = "Cruiser"
        };

        if (lowerSearch.includes("Scooty")) {
            query.category = "Scooty"
        };

        query.$or = [
            { brand_name: { $regex: search, $options: "i" } },
            { model: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }


    if (brand_name) {
        query.brand_name = brand
    };

    if (category) {
        query.category = category
    };

    if (model) {
        query.model = model
    };

    if (availability !== undefined) {
        query.availability = availability === "true"
    };

    if (city) {
        query.city = city
    };

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (req.user?.city && !city) {
        query.city = req.user.city;
    }

    const noFilters =
        !search &&
        !brand &&
        !model &&
        !category &&
        !minPrice &&
        !maxPrice &&
        !city;

    if (noFilters) {
        const categories = await Bike.distinct("category");
        const groupedBikes = {};

        for (const cat of categories) {
            groupedBikes[cat] = await Bike.find({
                category: cat,
                availability: true
            })
                .sort({ createdAt: -1 })
                .limit(10);
        }

        return res.status(200).json(
            new ApiResponse(200, groupedBikes, "Bikes grouped by category")
        );
    }

    const bikes = await Bike.find(query).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, bikes, "Cars fetched successfully")
    );
});

const getSingleBike = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let bike;

    if(!req.user){
        bike = await Bike.findById(id).select(
            "-registrationNumber"
        )
    }else{
        bike = await Bike.findById(id)
    }
    

    if(!bike){
        throw new ApiError(404, "Bike not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, bike, "BBike fetched successfully.")
    )
});

const addBike = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can add bikes");
    }

    const {
        name, description, brand, model,
        engine_CC, mileage, kmRun,
        price, registrationNumber, availability
    } = req.body;

    if (!name || !brand || !model || !price || !registrationNumber) {
        throw new ApiError(400, "Required fields missing");
    }

    const existingBike = await Car.findOne({ registrationNumber });

    if (existingBike) {
        throw new ApiError(409, "Bike already registered");
    }

    const BikeImageLocalPaths = req.files?.CarImage?.map(file => file.path);

    if (!BikeImageLocalPaths || BikeImageLocalPaths.length === 0) {
        throw new ApiError(400, "Minimum one bike image required");
    }

    const uploadedImages = await Promise.all(
        BikeImageLocalPaths.map(path => uploadOnCloudinary(path))
    );

    const images = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id
    }));

    const newCar = await Bike.create({
        name,
        description,
        brand,
        model,
        engine_CC,
        mileage,
        kmRun,
        price,
        registrationNumber,
        availability,
        images
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, newCar, "New bike added successfully")
        );
});

const deleteBike = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can delete bikes");
    }

    const { registrationNumber } = req.params;

    const bike = await Bike.findOne({ registrationNumber });

    if (!bike) {
        throw new ApiError(404, "Bike not found");
    }

    const publicIds = bike.images?.map(img => img.public_id) || [];

    if (publicIds.length > 0) {
        await deleteFromCloudinary(publicIds);
    }

    await Bike.deleteOne({ registrationNumber });

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Bike deleted successfully")
        );
});

export {
    deleteBike,
    addBike,
    getBikes,
    getSingleBike
}