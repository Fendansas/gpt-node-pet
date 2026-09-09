import express from 'express';
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    createUserSchema,
    loginSchema,
    updateUserSchema
} from "../validations/user.validation.js";
import validate from "../middleware/validation.middleware.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";
import rateLimit from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get(
    '/',
    asyncHandler(authMiddleware),
    roleMiddleware('admin'),
    asyncHandler(userController.getUsers)
);

router.post(
    '/',
    validate(createUserSchema),
    asyncHandler(userController.createUser)
);

router.get('/me',
    asyncHandler(authMiddleware),
    asyncHandler(userController.getMe)
);

router.patch('/me',
    asyncHandler(authMiddleware),
    validate(updateUserSchema),
    asyncHandler(userController.updateMe)
);

router.patch('/:id/deactivate',
    asyncHandler(authMiddleware),
    roleMiddleware('admin'),
    validateObjectId,
    asyncHandler(userController.deactivateUser)
)

router.patch('/:id/activate',
    asyncHandler(authMiddleware),
    roleMiddleware('admin'),
    validateObjectId,
    asyncHandler(userController.activateUser),
)

router.delete('/me',
    asyncHandler(authMiddleware),
    asyncHandler(userController.deleteMe)
);

router.post('/login',
    rateLimit,
    validate(loginSchema),
    asyncHandler(userController.loginUser),
);

router.post(
    '/logout-all',
    asyncHandler(authMiddleware),
    asyncHandler(userController.logoutAll)
);

router.post(
    '/logout',
    asyncHandler(userController.logout)
);

export default router;