import express from 'express';
import user from './app/routes/user.routes.js'
import connectDB from "./app/config/database.js";
import dotenv from 'dotenv';

const app = express();
const port = 3333;

dotenv.config()

await connectDB();
app.use(express.json());

app.use('/users',user);

app.use((err, req, res, next) => {

    let statusCode = err.statusCode;

    if (!statusCode && err.name === 'ValidationError') {
        statusCode = 400;
    }
    if (!statusCode){
        statusCode = 500
    }

    const errors = Object.values(err.errors);
    const normalizedErrors = error.map(error => {
        return {
            field: error.path,
            message: error.message
        };
    });



    const response = {
        status: 'error',
        message: err.message
    };

    if (err.errors?.length) {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
})

app.listen(port,()=>{
    console.log(`Server start on port ${port}`)
})