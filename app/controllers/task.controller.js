import taskService from "../services/task.service.js";


class TaskController {
    async createTask (req, res, next){
        const data = {
            ...req.body,
            createdBy: req.user.userId
        };

        const task = await taskService.createTask(data)
        return res.status(201).json(task)

    }
}

export default new TaskController();