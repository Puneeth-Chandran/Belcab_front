import express from 'express';
const app = express();

import dotenv from 'dotenv';
import { connectDatabase } from './config/dbConnect.js';
import errorMiddlware from './middlewares/errors.js';

//Handle uncaught exceptions
process.on('uncaughtException', (err)=>{
    console.log(`ERROR: ${err}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})

dotenv.config({path:'backend/config/config.env'});

//Connecting to database
connectDatabase();

app.use(express.json())

//Import all routes
import productRoutes from './routes/products.js';

app.use("/api/bel",productRoutes);

//Using error middleware
app.use(errorMiddlware);

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

//Handle unhandled Promise rejection
process.on('unhandledRejection',(err)=>{
    console.log(`ERROR ${err}`);
    console.log("Shutting down due to unhandled promise rejection.");
    server.close(() =>{
        process.exit(1);
    });
});