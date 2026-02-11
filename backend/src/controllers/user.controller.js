import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessandRefreshToken = async(UserId) => {
    try {
        const user = await User.findById(UserId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        user.save({validateBeforeSave : false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Error occured in Token Generation. Please Try again.")
    }
}

const registerUser=async(req, res)=>{
    // const {username , email, fullname, password, admin = "false", phone, address}= req.body;
   let {
  username,
  email,
  fullname,
  password,
  admin = false,
  phone,
  address
} = req.body || {};

const cleanUsername = username?.trim();
  const cleanEmail = email?.trim();

    if (
        [username , email, fullname, password, phone, address].some(field => !field || field.trim() === "")
    ){
        throw new ApiError(400, "All fields are required!")
    }

    const existinguser = await User.findOne({
        $or : [{username}, {email}, {phone}]
    })

    if(existinguser){
        throw new ApiError(409, "User already exists!")
    }

    const user = await User.create({
        username,
        email,
        fullname,
        password,
        admin,
        phone,
        address
    })
    
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500, "Some Error occured during registration!! Please try again.")
    }

    return res.status(201).json(
        new ApiResponse(201, createduser, "User registered successfully.")
    )

}


const loginUser= async (req, res)=>{

    const {email, username, admin = "false", password} = req.body

    const UsernameorEmail = username?.trim() || email?.trim();

    if (!UsernameorEmail) {
        throw new ApiError(400, "Either Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const IsPasswordValid = await user.isPasswordCorrect(password)

    if(!IsPasswordValid){
        throw new ApiError(401, "INvalid Credentials")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure : true
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

}


const logoutUser = asyncHandler(async (req, res) => {x
 
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
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

export  { registerUser, loginUser, logoutUser }