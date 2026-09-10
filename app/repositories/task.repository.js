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

    async getTasks(filter, sort){
        const tasks = await Task.find(filter).sort(sort);
        return tasks
    }
}


export default new TaskRepository();