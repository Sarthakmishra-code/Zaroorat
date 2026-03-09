import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendAdminRequestEmail } from "../utils/sendEmail.js";

const generateAccessandRefreshToken = async (UserId) => {
    try {
        const user = await User.findById(UserId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error occured in Token Generation. Please Try again.")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    let {
        username,
        email,
        fullname,
        password,
        admin = false,
        applyForAdmin = false,
        phone,
        address
    } = req.body || {};

    if (
        [username, email, fullname, password, phone, address].some(field => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    const existinguser = await User.findOne({
        $or: [{ username }, { email }, { phone }]
    })

    if (existinguser) {
        throw new ApiError(409, "User already exists!")
    }

    const user = await User.create({
        username,
        email,
        fullname,
        password,
        admin,
        applyForAdmin,
        phone,
        address
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createduser) {
        throw new ApiError(500, "Some Error occured during registration!! Please try again.")
    }

    if (applyForAdmin) {
        // Asynchronously send the email notification so it doesn't block the request response
        sendAdminRequestEmail({ username, fullname, email, phone, address });
    }

    return res.status(201).json(
        new ApiResponse(201, createduser, "User registered successfully.")
    )

})


const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    const UsernameorEmail = username?.trim() || email?.trim();

    if (!UsernameorEmail) {
        throw new ApiError(400, "Either Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{ username: UsernameorEmail }, { email: UsernameorEmail }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const IsPasswordValid = await user.isPasswordCorrect(password)

    if (!IsPasswordValid) {
        throw new ApiError(401, "Invalid Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully."
            )
        )

})


const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email, phone, address } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "Fullname and email are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
                phone,
                address
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

export { registerUser, loginUser, logoutUser, getCurrentUser, updateAccountDetails }