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

    async updateTask(id, data, expectedStatus = null, session = null) {

        const filter = {_id: id};
        const { updateData, history } = data;

        if (expectedStatus !== null) {
            filter.status = expectedStatus;
        }
        let update = {
            $set: updateData
        };
        if (history){
            update.$push = {
                history
            }
        }
        const task = await Task.findOneAndUpdate(
            filter,
            update,
            {
                new: true,
                runValidators: true,
                ...(session && {session})
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


    async addAttachment(id, attachment){
        const task = await Task.findByIdAndUpdate(
            id,
            {$push:
                    {attachments: attachment}
            },
            {
                new: true,
                runValidators: true
            }
        );

        return task

    }

    async getDoneTaskStats(){
        const tasks = await Task.aggregate([
            {$match: {status: 'done'}},
            {$group:{
                _id: '$status',
                count: {$sum: 1}

                }}
        ])
        return tasks
    }

    async getTaskStats(filter){
        const pipeline = [];
        if (filter) {
            pipeline.push({ $match: filter });
        }

        pipeline.push({
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        });

        pipeline.push({
            $project: {
                status: '$_id',
                count: 1,
                _id: 0
            }
        });

        const tasks = await Task.aggregate(pipeline);
        return tasks;
    }

    async getTaskStatsByAssignee(filter){
        const pipeline = [];
        if (filter) {
            pipeline.push({ $match: filter });
        }
        pipeline.push({
            $match: { assignedTo: { $ne: null }}
        });

        pipeline.push({
            $group: {
                _id: {
                    assignedTo: '$assignedTo',
                    status: '$status'
                },
                count: { $sum: 1 }
            }
        });

        pipeline.push({
            $project: {
                assignedTo: '$_id.assignedTo',
                status: '$_id.status',
                count: 1,
                _id: 0
            }
        });

        const tasks = await Task.aggregate(pipeline);
        return tasks;
    }



}


export default new TaskRepository();