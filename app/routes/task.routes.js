import express from 'express';
import {createTaskSchema} from "../validations/task.validation.js";
import taskController from "../controllers/task.controller.js";

import {asyncHandler} from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";



const router = express.Router();


router.post(
    '/',
    asyncHandler(authMiddleware),
    validate(createTaskSchema),
    asyncHandler(taskController.createTask)
);

export default router;