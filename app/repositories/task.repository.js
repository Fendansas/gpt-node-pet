import Task from "../models/task.model.js";

class TaskRepository{

    async createTask(data) {

            const task = await Task.create({
                title: data.title,
                description: data.description,
                priority: data.priority,
                createdBy: data.createdBy
            })
            return task;

    }

    async getTasks(filter, sort, limit, page) {

        let countDocuments = await Task.countDocuments(filter)
        const allPages = Math.ceil(countDocuments / limit)
        const skip = (page - 1) * limit;

        let tasks;

        if (sort) {
            tasks = await Task.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit);
        } else {
            tasks = await Task.find(filter)
                .skip(skip)
                .limit(limit);
        }

        return {
            tasks,
            pagination: {
                total: countDocuments,
                page,
                limit,
                totalPages: allPages
            }
        }
    }
}


export default new TaskRepository();