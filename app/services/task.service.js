import taskRepository from "../repositories/task.repository.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import userRepository from "../repositories/user.repository.js";


class TaskService{


    async createTask(data) {

        if (data.assignedTo){
            const assignedTo = await userRepository.getUserById(data.assignedTo);
            if (!assignedTo) {
                throw new NotFoundError('Assigned user not found');
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

        const isCreator = task.createdBy.toString() === user.userId.toString()
        const isAssignee = task.assignedTo && task.assignedTo.toString() === user.userId.toString();

        if (isCreator === false && isAssignee === false && user.role !== 'admin'){
            throw new ForbiddenError('Forbidden');
        }

        let updateData;
        if (user.role === 'admin'){
            updateData = data;
        }

        if (isCreator ){
            updateData = {};

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

        }

        if (isAssignee && !isCreator){
            updateData = {};
            if(data.status !== undefined){
                updateData.status = data.status
            }

        }
        if (updateData.assignedTo !== undefined) {
            const newAssignedTo = await userRepository.getUserById(updateData.assignedTo);

            if (!newAssignedTo) {
                throw new NotFoundError('Assigned user not found');
            }
        }





    }
}

export default new TaskService();