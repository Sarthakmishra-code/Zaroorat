import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username : {
            type: String,
            required: true,
            lowercase : true,
            unique : true,
            trim: true
        },
        
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email id!"],
            lowercase : true,
            unique : true,
            trim: true
        },

        username : {
            type: String,
            required: true,
            lowercase : true,
            unique : true,
            trim: true
        },

        password: {
            type: String,
            required: true,
        },

        phone : {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        
        city: {
            type: String,
            required: true,
        },

        orders: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            },
        ],
    },
    {
    timestamps: true,
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)