import mongoose from "mongoose"
import {ValidationError} from "../errors/ValidationError.js";



const validateObjectId = (req, res, next) =>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ValidationError('Invalid user id'));
    }
    next();

}

export default validateObjectId;