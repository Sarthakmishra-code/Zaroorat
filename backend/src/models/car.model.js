import mongoose, {Schema} from "mongoose";

const carSchema = new mongoose.Schema(
  {
    // carId: {
    //   type: String,
    //   unique: true,
    //   required: true,
    // },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
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

    category: {
      type: String,
      required: true
    },

    seatingCapacity: {
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

    city: {
      type: String,
      required: true
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

export const Car = mongoose.model("Car", carSchema);
