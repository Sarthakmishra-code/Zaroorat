import mongoose, {Schema} from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    seatingCapacity: {
      type: Number,
      required: true,
    },

    mileage: {
      type: String, 
    },

    kmRun: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    registrationNumber: {
      type: String,
      unique: true,
      trim: true,
    },

    availability: {
      type: Boolean,
      default: true,
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
  {
    timestamps: true,
  }
);

export const car = mongoose.model("Car", carSchema);
