import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    hostelId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    roomCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    ac: {
      type: Boolean,
      default: true,
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

export const Hostel = mongoose.model("Hostel", hostelSchema);
