import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceType: {
      type: String,
      enum: ["bike", "car", "hostel"],
      required: true,
    },

    serviceObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "serviceModel",
    },

    serviceModel: {
      type: String,
      enum: ["Bike", "Car", "Hostel"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
