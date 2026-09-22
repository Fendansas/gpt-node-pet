import Task from "../models/task.model.js";

class TaskRepository{

    async createTask(data) {

            const task = await Task.create({
                title: data.title,
                description: data.description,
                priority: data.priority,
                createdBy: data.createdBy,
                assignedTo: data.assignedTo
            })
            return task;

    }

    async getTasks(filter, sort, limit, page) {

        const countDocuments = await Task.countDocuments(filter)
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

    async updateTask(id, data, expectedStatus = null) {

        const filter = {_id: id};

        if (expectedStatus !== null) {
            filter.status = expectedStatus;
        }

        const task = await Task.findByIdAndUpdate(
            filter,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        return task;

    }

    async getTaskById(id){
        return Task.findById(id);
    }


    async deleteTask(id){
        return Task.findByIdAndDelete(id);
    }
}


export default new TaskRepository();