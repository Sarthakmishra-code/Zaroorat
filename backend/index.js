import express from 'express';
const app = express();
import { connectDB } from './config/db.js';
app.use(express.json());
const PORT = 5000;

import dotenv from 'dotenv';
dotenv.config();


connectDB();

app.listen(PORT,()=> console.log(`Server is started o port: ${(PORT)}`));