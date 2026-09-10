import taskRepository from "../repositories/task.repository.js";


class TaskService{


    async createTask(data) {
        const task = await taskRepository.createTask(data)

        return task
    }

    async getTasks(filter, sort){
        const tasks = await taskRepository.getTasks(filter, sort)
        return tasks
    }
}

export default new TaskService();