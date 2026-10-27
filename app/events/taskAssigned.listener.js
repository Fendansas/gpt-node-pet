import emitter from './eventEmitter.js'
import { addTaskAssignedJob } from '../queues/notification.queue.js';

emitter.on('task.assigned', (data) => {
    try {
        console.log('Task assigned:', data.taskId);
    } catch (error){
        console.error(error)
    }

});

emitter.on('task.assigned', (data) => {

    try {
        console.log('Task assigned To:', data.assignedTo);
    } catch (error){
        console.error(error)
    }
});

emitter.on('task.assigned', async (data) => {

    try {
        await addTaskAssignedJob(data.taskId, data.assignedTo)
    } catch (error){
        console.error(error)
    }
});