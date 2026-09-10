import taskRepository from "../repositories/task.repository.js";


class TaskService{


    async createTask(data) {
        const task = await taskRepository.createTask(data)

        return task
    }
}

export default new TaskService();