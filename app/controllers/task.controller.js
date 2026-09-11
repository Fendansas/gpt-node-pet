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

        let {
            status,
            priority,
            sort,
            page,
            limit
        } = req.query;

        if (!page){
            page = 1
        }

        if (!limit){
            limit = 5
        }
        const allowedSortFields = [
            'createdAt',
            'priority'
        ];
        const sortField = sort?.replace('-', '');

        if (!allowedSortFields.includes(sortField)) {
            sort = '';
        }

        const filter = {};

        if(status){
            filter.status = status;
        }
        if(priority){
            filter.priority = priority
        }


        const tasks = await taskService.getTasks(filter, sort, Number(limit), Number(page));
        return res.status(200).json(tasks)
    }
}

export default new TaskController();