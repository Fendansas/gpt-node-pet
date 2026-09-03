import {ForbiddenError} from "../errors/ForbiddenError.js";

const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {


        const role = req.user.role;

        if (role !== requiredRole) {
            return next(new ForbiddenError('Forbidden'));
        }


        next();

    }
}

export default roleMiddleware;