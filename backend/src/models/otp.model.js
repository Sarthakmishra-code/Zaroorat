import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        otp: {
            type: String,
            required: true
        },
        formData: {
            type: Object,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600 
        }
    }
);

export const OTP = mongoose.model("OTP", otpSchema);
