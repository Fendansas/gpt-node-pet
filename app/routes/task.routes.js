import express from 'express';
import {createTaskSchema, updateTaskSchema} from "../validations/task.validation.js";
import taskController from "../controllers/task.controller.js";

import {asyncHandler} from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import validateQuery from "../middleware/validateQuery.middleware.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import requireFile from "../middleware/requireFile.middleware.js";
import upload from "../middleware/upload.middleware.js";
import fileType from "../middleware/validateFileContent.js";


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
    validateObjectId('id', 'task'),
    asyncHandler(taskController.getTaskById)
)

router.patch('/:id',
    asyncHandler(authMiddleware),
    validateObjectId('id', 'task'),
    validate(updateTaskSchema),
    asyncHandler(taskController.updateTask)
);

router.post('/:id/cancel',
    asyncHandler(authMiddleware),
    validateObjectId('id', 'task'),
    asyncHandler(taskController.cancelTask)

    );

router.delete('/:id',
    asyncHandler(authMiddleware),
    roleMiddleware('admin'),
    validateObjectId('id', 'task'),
    asyncHandler(taskController.deleteTask));


router.post(
    '/:id/files',
    asyncHandler(authMiddleware),
    validateObjectId('id', 'task'),
    upload.single('file'),
    requireFile,
    fileType,
    asyncHandler(taskController.addAttachment)
);

router.get(
    '/:id/files/:fileId',
    asyncHandler(authMiddleware),
    validateObjectId('id', 'task'),
    validateObjectId('fileId', 'file'),
    asyncHandler(taskController.getFile)

)



export default router;