import mongoose from "mongoose"
import {ValidationError} from "../errors/ValidationError.js";


const validateObjectId = (parameter) => {
    return (req, res, next) => {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ValidationError(`Invalid ${parameter} id`));
        }
        next();
    }
}

export default validateObjectId;