import express from 'express';
import user from './app/routes/user.routes.js'
import task from './app/routes/task.routes.js'

const app = express();

app.use(express.json());

app.use('/users',user);
app.use('/tasks',task);


app.use((err, req, res, next) => {

    let statusCode = err.statusCode;

    if (!statusCode && err.name === 'ValidationError') {
        statusCode = 400;
    }
    if (!statusCode && err.name === 'CastError') {
        statusCode = 400;
    }

    if (!statusCode){
        statusCode = 500
    }
    const response = {
        status: 'error',
        message: err.message
    };
    if (err.errors && !Array.isArray(err.errors)) {
        const mongooseErrors = Object.values(err.errors);

        const normalizedErrors = mongooseErrors.map(error => {
            return {
                field: error.path,
                message: error.message
            };
        });

        response.errors = normalizedErrors;
    }


    if (err.errors?.length) {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
})

export default app