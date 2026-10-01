import taskRepository from "../repositories/task.repository.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import userRepository from "../repositories/user.repository.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";
import { canTransition } from "../utils/taskStatusTransitions.js";
import { canChangeStatus } from "../utils/taskStatusPermissions.js";
import {ConflictError} from "../errors/ConflictError.js";
import {taskResponse} from "../utils/taskResponse.js";
import {deleteFile} from "../utils/deleteFile.js";

class TaskService{


    async createTask(data) {

        if (data.assignedTo){
            const assignedTo = await userRepository.getUserById(data.assignedTo);
            if (!assignedTo) {
                throw new NotFoundError('Assigned user not found');
            }
            if (!assignedTo.isActive) {
                throw new ForbiddenError('Cannot assign task to inactive user');
            }
        }

        const task = await taskRepository.createTask(data)

        return taskResponse(task);
    }

    async getTasks(user, filter, sort, limit, page){

        if (user.role !== 'admin'){
            filter.$or = [
                {createdBy: user.userId},
                {assignedTo: user.userId}
            ]
        }
        const result = await taskRepository.getTasks(filter, sort, limit, page);

        result.tasks = result.tasks.map(taks => taskResponse(taks))

        return result
    }

    async updateTask(id, data, user) {
        const task = await taskRepository.getTaskById(id)

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        if (data.status !== undefined && user.role !== 'admin') {
            const currentStatus = task.status;
            const newStatus = data.status;

            if (!canTransition(currentStatus, newStatus)) {
                throw new ForbiddenError('Invalid status transition')
            }

            if (!canChangeStatus(task, user, currentStatus, newStatus)) {
                throw new ForbiddenError('You cannot change task status')
            }
        }

        const isCreator = task.createdBy.toString() === user.userId.toString()

        const isAssignee =
            !!task.assignedTo &&
            task.assignedTo.toString() === user.userId.toString();

        if (!isCreator && !isAssignee && user.role !== 'admin') {
            throw new ForbiddenError('Forbidden');
        }

        let updateData = {};

        if (user.role === 'admin') {
            if (data.title !== undefined) {
                updateData.title = data.title
            }

            if (data.description !== undefined) {
                updateData.description = data.description
            }

            if (data.priority !== undefined) {
                updateData.priority = data.priority
            }

            if (data.assignedTo !== undefined) {
                updateData.assignedTo = data.assignedTo
            }

            if (data.status !== undefined) {
                updateData.status = data.status;
            }
        } else if (isCreator) {
            if (data.title !== undefined) {
                updateData.title = data.title
            }

            if (data.description !== undefined) {
                updateData.description = data.description
            }

            if (data.priority !== undefined) {
                updateData.priority = data.priority
            }

            if (data.assignedTo !== undefined) {
                updateData.assignedTo = data.assignedTo
            }

            if (data.status !== undefined) {
                updateData.status = data.status;
            }

        } else if (isAssignee) {
            if (data.status !== undefined) {
                updateData.status = data.status
            }
        }

        if (updateData.assignedTo !== undefined && updateData.assignedTo !== null) {
            const newAssignedTo = await userRepository.getUserById(updateData.assignedTo);

            if (!newAssignedTo) {
                throw new NotFoundError('Assigned user not found');
            }

            if (!newAssignedTo.isActive) {
                throw new ForbiddenError('Cannot assign task to inactive user');
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new ForbiddenError('Forbidden');
        }

        let updatedTask;

        if (data.status !== undefined && user.role !== 'admin') {
            updatedTask = await taskRepository.updateTask(
                id,
                updateData,
                task.status
            );
        } else {
            updatedTask = await taskRepository.updateTask(
                id,
                updateData
            );
        }
        
        if (!updatedTask) {
            throw new ConflictError('Task was modified by another request');
        }

        return taskResponse(updatedTask);
    }

    async getTaskById(id, user){

        const task = await taskRepository.getTaskById(id)

        if (!task){
            throw new NotFoundError('Task not found');
        }

        const isCreator = task.createdBy.toString() === user.userId.toString()
        const isAssignee = !!task.assignedTo && task.assignedTo.toString() === user.userId.toString();

        if (isCreator === false && isAssignee === false && user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        return taskResponse(task);


    }

    async addAttachment(id, attachment, user) {
        const task = await taskRepository.getTaskById(id)

        if (!task){
            throw new NotFoundError('Task not found');
        }

        const isCreator = task.createdBy.toString() === user.userId.toString()
        const isAssignee = !!task.assignedTo && task.assignedTo.toString() === user.userId.toString();

        if (isCreator === false && isAssignee === false && user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        return taskResponse(taskRepository.addAttachment(id, attachment))


    }

    async deleteTask(id, user){

        const task = await taskRepository.getTaskById(id)

        if (!task){
            throw new NotFoundError('Task not found');
        }


        if (user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        for (const attachment of task.attachments) {
            try {
                await deleteFile(attachment.path)
            } catch (error){
                console.log(error)
            }

        }

        await taskRepository.deleteTask(id)

    }


    async cancelTask(id, user){
        const task = await taskRepository.getTaskById(id);

        if(!task){
            throw new NotFoundError('Task not found');
        }

        const isCreator = task.createdBy.toString() === user.userId.toString();

        if (!isCreator && user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        if(task.status === 'cancelled'){
            throw new ForbiddenError('Task is already cancelled')
        }

        if(task.status === 'done' && user.role !== 'admin'){
            throw new ForbiddenError('Cannot cancel completed task')
        }

        const updatedTask = await taskRepository.updateTask(id, {status: 'cancelled'}, task.status)
        if (!updatedTask) {
            throw new ConflictError('Task was modified by another request');
        }

        return taskResponse(updatedTask);
    }


    async getFile(taskId, fileId, user) {
        const task = await taskRepository.getTaskById(taskId)

        if (!task){
            throw new NotFoundError('Task not found')
        }
        const isCreator = task.createdBy.toString() === user.userId.toString();
        const isAssignee = !!task.assignedTo && task.assignedTo.toString() === user.userId.toString();

        if (!isCreator && !isAssignee && user.role !== 'admin') {
            throw new ForbiddenError('Forbidden');
        }

        const attachment = task.attachments.find(
            attachment => attachment._id.toString() === fileId
        )
        if (!attachment) {
            throw new NotFoundError('File not found');
        }


        return attachment


    }
}

export default new TaskService();