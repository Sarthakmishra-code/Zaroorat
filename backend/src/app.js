import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config({ path: './.env' })

const app = express()

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(cors({
    origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import bikeRouter from "./routes/bike.routes.js";
import carRouter from "./routes/car.routes.js";
import hostelRouter from "./routes/hostel.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.use("/api/v1/users", userRouter)
app.use("/api/v1/cars", carRouter)
app.use("/api/v1/bikes", bikeRouter)
app.use("/api/v1/hostels", hostelRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/admin", adminRouter)

export default app;
