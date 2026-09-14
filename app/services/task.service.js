import taskRepository from "../repositories/task.repository.js";


class TaskService{


    async createTask(data) {
        const task = await taskRepository.createTask(data)

        return task
    }

    async getTasks(user, filter, sort, limit, page){

        if (user.role !== 'admin'){
            filter.createdBy = user.userId
        }
        const tasks = await taskRepository.getTasks(filter, sort, limit, page);

        return tasks
    }
}

export default new TaskService();