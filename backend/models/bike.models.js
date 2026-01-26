const mongoose = require('mongoose');
const bike_Schema= new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand_name: {
      type: String,
      required: [true],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    engine_CC:{
        type: Number,
        required: [true],
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bike", bikeSchema);