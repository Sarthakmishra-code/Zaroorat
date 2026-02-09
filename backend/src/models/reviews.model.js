import mongoose, {Schema} from "mongoose";


const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Order"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)



export const Comment = mongoose.model("Comment", commentSchema)