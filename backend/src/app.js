import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "../src/routes/user.routes.js";
import bikeRouter from "../src/routes/bike.routes.js";
import carRouter from "../src/routes/car.routes.js";

app.use("/api/v1/users", userRouter)
app.use("/api/v1/cars", carRouter)
app.use("/api/v1/bikes", bikeRouter)

export default app;
