import {ForbiddenError} from "../errors/ForbiddenError.js";

const roleMiddleware = (...roles) => {
    return (req, res, next) => {

        const role = req.user.role;

        if (!roles.includes(role)) {
            return next(new ForbiddenError('Forbidden'));
        }


        next();

    }
}

export default roleMiddleware;