import {Unauthorized} from "../errors/Unauthorized.js";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new Unauthorized('Unauthorized'));
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return next(new Unauthorized('Unauthorized'));
    }

    const token = parts[1];

    if (!token) {
        return next(new Unauthorized('Unauthorized'));
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new Unauthorized('Unauthorized'));
    }

    const user = await UserRepository.getUserById(decoded.userId);



    if (!user) {
        return next(new Unauthorized('Unauthorized'));
    }
    if (user.tokenVersion !== decoded.tokenVersion){
        return next(new Unauthorized('Unauthorized'));
    }

    if (user.isActive === false) {
        return next(new ForbiddenError('Forbidden'));
    }
    const data = {
        userId: decoded.userId,
        role: user.role,
        isActive: user.isActive
    }

    req.user = data;

    next();
};

export default authMiddleware;