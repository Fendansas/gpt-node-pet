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
}

export default new TaskService();