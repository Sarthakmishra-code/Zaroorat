import express from 'express';
// const authRoutes = require('../src/routes/auth.Route');
import authRoutes from '../src/routes/auth.Route.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/api/auth', authRoutes);

app.get('/test', (req, res) => {
  res.send('Server is alive');
});


// module.exports = app;
export default app

