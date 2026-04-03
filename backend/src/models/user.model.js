import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        admin: {
            type: Boolean,
            default: false,
            required: true
        },

        applyForAdmin: {
            type: Boolean,
            default: false
        },

        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email id!"],
            lowercase: true,
            unique: true,
            trim: true
        },

        fullname: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: function() {
                return this.authProvider === 'local';
            }
        },

        phone: {
            type: Number,
            unique: true,
            sparse: true, // Handle null or missing values gracefully since it's unique
            trim: true
        },

        address: {
            type: String,
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },

        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],

        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)