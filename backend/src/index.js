import connectdb from "./db/index.js";
import dotenv from 'dotenv'
import app from "./app.js";

dotenv.config({})

// const PORT = process.env.PORT || 5000
console.log("Start")
connectdb()
.then(() => {
    app.listen(5000, () => {
        console.log(`⚙️ Server is running at port : ${5000}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})