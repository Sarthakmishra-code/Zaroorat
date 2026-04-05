import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OTP } from "../models/otp.model.js";
import { sendAdminRequestEmail, sendOTPEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        $or: [
            { username: username?.toLowerCase() }, 
            { email: email?.toLowerCase() }, 
            { phone }
        ]
    })

    if (existinguser) {
        throw new ApiError(409, "User already exists!")
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in database
    await OTP.create({
        email,
        otp,
        formData: req.body
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
        // If email fails, we shouldn't prevent them from trying again, 
        // but let's notify the frontend
        throw new ApiError(500, "Failed to send OTP email. Please try again.");
    }

    return res.status(200).json(
        new ApiResponse(200, { email }, "OTP sent to email successfully. Please verify.")
    )
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    // Find the latest OTP for this email
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
        throw new ApiError(400, "OTP expired or invalid");
    }

    if (otpRecord.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    // OTP is valid. Now we create the user using the stored formData.
    const {
        username,
        fullname,
        password,
        admin = false,
        applyForAdmin = false,
        phone,
        address
    } = otpRecord.formData;

    const user = await User.create({
        username,
        email,
        fullname,
        password,
        admin,
        applyForAdmin,
        phone,
        address
    });

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createduser) {
        throw new ApiError(500, "Some Error occured during registration!! Please try again.");
    }

    // Delete the OTP record since it's used
    await OTP.deleteMany({ email });

    if (applyForAdmin) {
        sendAdminRequestEmail({ username, fullname, email, phone, address });
    }

    return res.status(201).json(
        new ApiResponse(201, createduser, "User registered successfully.")
    );
});


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

const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        throw new ApiError(400, "Google credential token is missing");
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        
        if (!payload) {
            throw new ApiError(400, "Invalid Google token payload");
        }

        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if they don't exist
            // Provide dummy values for phone and address as they are required initially
            // Mongoose will let them pass if we use unique sparse appropriately
            let baseUsername = email.split('@')[0];
            let username = baseUsername;
            let counter = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            user = await User.create({
                username,
                email,
                fullname: name,
                googleId,
                authProvider: 'google',
                // phone and address are empty but allowed due to sparse unique indexing
            });
        } else if (user && user.authProvider === 'local') {
            // Link google account to existing local account
            user.googleId = googleId;
            user.authProvider = 'google';
            await user.save({ validateBeforeSave: false });
        }

        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

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
                    "User logged in with Google successfully."
                )
            );
    } catch (error) {
        console.error("Google Auth Error:", error);
        throw new ApiError(401, "Google Authentication failed");
    }
});



const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            returnDocument: 'after',
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
        { returnDocument: 'after' }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const approveAdmin = asyncHandler(async (req, res) => {
    const { email } = req.query;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOneAndUpdate(
        { email },
        { admin: true },
        { returnDocument: 'after' }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).send(`
        <html>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">Success!</h1>
                <p>User <strong>${user.email}</strong> is now an Admin for Zaroorat.</p>
            </body>
        </html>
    `);
});

export { registerUser, verifyOTP, loginUser, googleLogin, logoutUser, getCurrentUser, updateAccountDetails, approveAdmin }
