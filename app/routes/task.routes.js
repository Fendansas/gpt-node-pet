import express from 'express';
import {createTaskSchema, updateTaskSchema} from "../validations/task.validation.js";
import taskController from "../controllers/task.controller.js";

import {asyncHandler} from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import validateQuery from "../middleware/validateQuery.middleware.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";


const router = express.Router();


router.post(
    '/',
    asyncHandler(authMiddleware),
    validate(createTaskSchema),
    asyncHandler(taskController.createTask)
);

router.get('/',
    asyncHandler(authMiddleware),
    validateQuery,
    asyncHandler(taskController.getTasks)
);

router.get('/:id',
    asyncHandler(authMiddleware),
    validateObjectId('task'),
    asyncHandler(taskController.getTaskById)
)

router.patch('/:id',
    asyncHandler(authMiddleware),
    validateObjectId('task'),
    validate(updateTaskSchema),
    asyncHandler(taskController.updateTask)
);

router.delete('/:id',
    asyncHandler(authMiddleware),
    validateObjectId('task'),
    asyncHandler(taskController.deleteTask));

export default router;