const express = require('express');
const app = express();
import { connectToMongoDB } from './config/db.js';
app.use(express.json());
const PORT = 5000;


connectToMongoDB();

app.listen(PORT,()=> console.log(`Server is started o port: ${(PORT)}`));