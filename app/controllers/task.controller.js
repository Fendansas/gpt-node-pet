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
        } = req.query;
        const{
            page = 1,
            limit = 5
        } = req.validatedQuery;

        const allowedSortFields = [
            'createdAt',
            'priority'
        ];
        const sortField = sort?.replace('-', '');
        let validSort = sort;
        if (!allowedSortFields.includes(sortField)) {
            validSort = '';
        }

        const filter = {};

        if(status){
            filter.status = status;
        }
        if(priority){
            filter.priority = priority
        }


        const tasks = await taskService.getTasks(filter, validSort, limit, page);
        return res.status(200).json(tasks)
    }
}

export default new TaskController();