import mongoose from "mongoose"
import {ValidationError} from "../errors/ValidationError.js";


const validateObjectId = (parameter, name) => {
    return (req, res, next) => {
        const id = req.params[parameter];
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ValidationError(`Invalid ${name} id`));
        }
        next();
    }
}

export default validateObjectId;