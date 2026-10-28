import {Queue} from "bullmq";


const queue = new Queue('notifications', {
    connection: {
        host: '127.0.0.1',
        port: 6379
    }
});

export function addTaskAssignedJob(taskId, assignedTo) {
    return queue.add('taskAssigned', {
            taskId: taskId,
            assignedTo: assignedTo
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,

            },
            removeOnComplete: 100,
            removeOnFail: 500
        },
    )
}

export default queue