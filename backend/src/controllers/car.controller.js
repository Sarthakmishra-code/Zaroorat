import { Car } from '../models/car.model.js'
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";

const getCars = asyncHandler(async (req, res) => {
    const {
        search,
        brand,
        model,
        category,
        seatingCapacity,
        minPrice,
        maxPrice,
        city
    } = req.query;

    const query = { availability: true };

    if (search) {
        const lowerSearch = search.toLowerCase();

        if (lowerSearch.includes("suv")) {
            query.category = "SUV"
        };

        if (lowerSearch.includes("sedan")) {
            query.category = "Sedan"
        };

        if (lowerSearch.includes("mini")) {
            query.category = "Mini"
        };

        const seatMatch = lowerSearch.match(/\d+/);

        if (seatMatch) {
            query.seatingCapacity = Number(seatMatch[0])
        };

        query.$or = [
            { brand_name: { $regex: search, $options: "i" } },
            { model: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }
    
    if (brand) {
        query.brand_name = brand
    };

    if (model) {
        query.model = model
    };

    if (category) {
        query.category = category
    };

    if (seatingCapacity) {
        query.seatingCapacity = Number(seatingCapacity)
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
        !seatingCapacity &&
        !minPrice &&
        !maxPrice &&
        !city;

    if (noFilters) {
        const categories = await Car.distinct("category");
        const groupedCars = {};

        for (const cat of categories) {
            groupedCars[cat] = await Car.find({
                category: cat,
                availability: true
            })
                .sort({ createdAt: -1 })
                .limit(10);
        }

        return res.status(200).json(
            new ApiResponse(200, groupedCars, "Cars grouped by category")
        );
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, cars, "Cars fetched successfully")
    );
});

const addCar = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can add cars");
    }

    const {
        name, description, brand, model,
        seatingCapacity, mileage, kmRun,
        price, registrationNumber, availability
    } = req.body;

    if (!name || !brand || !model || !price || !registrationNumber) {
        throw new ApiError(400, "Required fields missing");
    }

    const existingCar = await Car.findOne({ registrationNumber });

    if (existingCar) {
        throw new ApiError(409, "Car already registered");
    }

    const CarImageLocalPaths = req.files?.CarImage?.map(file => file.path);

    if (!CarImageLocalPaths || CarImageLocalPaths.length === 0) {
        throw new ApiError(400, "Minimum one car image required");
    }

    const uploadedImages = await Promise.all(
        CarImageLocalPaths.map(path => uploadOnCloudinary(path))
    );

    const images = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id
    }));

    const newCar = await Car.create({
        name,
        description,
        brand,
        model,
        seatingCapacity,
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
            new ApiResponse(201, newCar, "New car added successfully")
        );
});

const deleteCar = asyncHandler(async (req, res) => {

    if (!req.user.admin) {
        throw new ApiError(403, "Only admins can delete cars");
    }

    const { registrationNumber } = req.params;

    const car = await Car.findOne({ registrationNumber });

    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    const publicIds = car.images?.map(img => img.public_id) || [];

    if (publicIds.length > 0) {
        await deleteFromCloudinary(publicIds);
    }

    await Car.deleteOne({ registrationNumber });

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Car deleted successfully")
        );
});




export {
    addCar,
    deleteCar,
    getCars
}