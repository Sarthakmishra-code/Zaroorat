import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        admin : {
            type: Boolean,
            default: false,
            required: true
        },
        
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

// export const User = mongoose.model("User", userSchema)
export default mongoose.model('User', userSchema);