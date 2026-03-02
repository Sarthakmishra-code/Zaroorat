import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
    {
        siteName: {
            type: String,
            default: "Zaroorat"
        },
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        commissionRate: {
            type: Number,
            default: 10 // Percentage
        },
        contactEmail: {
            type: String,
            default: "support@zaroorat.com"
        }
    },
    {
        timestamps: true
    }
);

export const Settings = mongoose.model("Settings", settingsSchema);
