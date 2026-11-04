import {Queue} from "bullmq";


const queue = new Queue('notifications', {
    connection: {
        host: '127.0.0.1',
        port: 6379
    }
});

export function addTaskAssignedJob(taskId, assignedTo,assignmentId, assignedBy) {
    return queue.add('taskAssigned', {
            taskId: taskId,
            assignedTo: assignedTo,
            assignmentId: assignmentId,
            assignedBy: assignedBy
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,

            },
            removeOnComplete: 100,
            removeOnFail: 500,
            jobId: 'task-assigned-' + taskId + '-' + assignedTo + '-' + assignmentId,
        },
    )
}

export default queue