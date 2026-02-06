import { connectDB } from '../backend/src/config/db.js';
import app from '../backend/src/app.js';
import dotenv from 'dotenv';
dotenv.config();

// const app= require('./src/app.js')

const PORT= process.env.PORT;

connectDB();
app.listen(5000,()=> console.log(`Server is started o port: ${(5000)}`));