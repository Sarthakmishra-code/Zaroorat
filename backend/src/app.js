import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "../src/routes/user.routes.js";
import carRouter from "../src/routes/car.routes.js"
import bikeRouter from "../src/routes/bike.routes.js"

app.use("/api/users", userRouter)

app.use("/api/cars", carRouter)

app.use("/api/bikes", bikeRouter)

export default app;
