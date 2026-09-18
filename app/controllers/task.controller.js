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

    async getTasks(req, res, next){

        const {
            status,
            priority,
            sort,
            page = 1,
            limit = 5
        } = req.validatedQuery;


        const filter = {};

        if(status){
            filter.status = status;
        }
        if(priority){
            filter.priority = priority
        }


        const tasks = await taskService.getTasks(req.user, filter, sort, limit, page);
        return res.status(200).json(tasks)
    }


    async updateTask(req, res, next){
        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user
        )

        return res.status(200).json(task);
    }

    async getTaskById(req, res, next){
        const task = await taskService.getTaskById(
            req.params.id,
            req.user
        )
        return res.status(200).json(task)
    }

    async deleteTask(req, res, next) {

        await taskService.deleteTask(
            req.params.id,
            req.user
        )

        return res.status(204).send()
    }

    async cancelTask(req, res, next){

        const task  = await taskService.cancelTask(req.params.id, req.user);

        return res.status(200).json(task)
    }
}

export default new TaskController();