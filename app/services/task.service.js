import taskRepository from "../repositories/task.repository.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import userRepository from "../repositories/user.repository.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";
import { canTransition } from "../utils/taskStatusTransitions.js";
import { canChangeStatus } from "../utils/taskStatusPermissions.js";
import {ConflictError} from "../errors/ConflictError.js";


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

        return task
    }

    async getTasks(user, filter, sort, limit, page){

        if (user.role !== 'admin'){
            filter.$or = [
                {createdBy: user.userId},
                {assignedTo: user.userId}
            ]
        }
        const tasks = await taskRepository.getTasks(filter, sort, limit, page);

        return tasks
    }

    async updateTask (id, data, user){
        const task = await taskRepository.getTaskById(id)

        if (!task){
            throw new NotFoundError('Task not found');
        }

        if(data.status !== undefined && user.role !== 'admin'){

            const currentStatus = task.status;
            const newStatus = data.status;

            if(!canTransition(currentStatus, newStatus)){
                throw new ForbiddenError('Invalid status transition')
            }

            if(!canChangeStatus(task, user, currentStatus, newStatus)){
                throw new ForbiddenError('You cannot change task status')
            }
        }



        const isCreator = task.createdBy.toString() === user.userId.toString()
        const isAssignee =
            !!task.assignedTo &&
            task.assignedTo.toString() === user.userId.toString();

        if (isCreator === false && isAssignee === false && user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        let updateData = {};


        if (user.role === 'admin') {
            updateData = data;
        } else if (isCreator) {

            if(data.title !== undefined){
                updateData.title = data.title
            }
            if(data.description !== undefined){
                updateData.description = data.description
            }
            if(data.priority !== undefined){
                updateData.priority = data.priority
            }
            if(data.assignedTo !== undefined){

                updateData.assignedTo = data.assignedTo
            }
            if (data.status !== undefined) {
                updateData.status = data.status;
            }
        } else if (isAssignee) {
            if(data.status !== undefined){
                updateData.status = data.status
            }
        }

        if (updateData.assignedTo !== undefined) {
            const newAssignedTo = await userRepository.getUserById(updateData.assignedTo);

            if (!newAssignedTo) {
                throw new NotFoundError('Assigned user not found');
            }

            if(!newAssignedTo.isActive){
                throw new ForbiddenError('Cannot assign task to inactive user');
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new ForbiddenError('Forbidden');
        }

        let updatedTask = await taskRepository.updateTask(id, updateData);

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
        return updatedTask

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

        return task;


    }

    async deleteTask(id, user){

        const task = await taskRepository.getTaskById(id)

        if (!task){
            throw new NotFoundError('Task not found');
        }


        if (user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        return  taskRepository.deleteTask(id)

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

        return taskRepository.updateTask(id, {status: 'cancelled'})
    }
}

export default new TaskService();