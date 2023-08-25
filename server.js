import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoute.js';
import categoryRoute from './routes/CategoryRoute.js'
import productRoute from './routes/ProductRoute.js'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

// Rest object
const app = express();

// config env
dotenv.config()

// database connection
connectDB();

// cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// middlewares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../client/dist')))


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);


// Rest API
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
})


PORT = process.env.POTR || 8080
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON ${process.env.DEV_MODE} MODE ON PORT ${PORT}`);
});