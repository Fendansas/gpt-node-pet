import taskService from "../services/task.service.js";
import {deleteFile} from "../utils/file.utils.js";


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

    async addAttachment (req, res, next) {
        const taskId = req.params.id
        const user = req.user
        const file = {
            originalName:req.file.originalname,
            filename:req.file.filename,
            path:req.file.path,
            mimetype:req.file.mimetype,
            size:req.file.size,
        }
        try {
            const task = await taskService.addAttachment(taskId, file, user)
            return res.status(200).json(task);
        } catch (error){
            try {
                await deleteFile(req.file.path)
            } catch (deleteError){
                console.error('Failed to delete uploaded file:', deleteError);
            }

            next(error)
        }


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