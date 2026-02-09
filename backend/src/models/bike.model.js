import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    bikeId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand_name: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    engine_CC: {
      type: Number,
      required: true,
    },

    kmRun: {
      type: Number,
      default: 0,
    },

    mileage: {
      type: String, 
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    registrationNumber: {
      type: String,
      unique: true,
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

export const Bike = mongoose.model("Bike", bikeSchema);
