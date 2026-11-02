import outboxRepository from "../repositories/outbox.repository.js";
import {addTaskAssignedJob} from "../queues/notification.queue.js";



export function processPending(){

    if (processingPromise) {
        return processingPromise;
    }
    processingPromise = ( async () =>{
        try {
            const pending = await outboxRepository.getPending();
            for (const element of pending) {
                if (element.eventType === 'task.assigned') {
                    try {
                        await addTaskAssignedJob(
                            element.payload.taskId,
                            element.payload.assignedTo,
                            element.payload.assignmentId
                        );
                        const processed = await outboxRepository.markProcessed(element._id)
                        if (!processed) {
                            throw new Error('Outbox event not found');
                        }
                    } catch (error) {
                        console.error(`Failed to process Outbox event ${element._id}:`, error);
                    }


                }
            }
        } finally {
            processingPromise = null;
        }
    })();

    return processingPromise


}
let processingPromise = null;
export async function waitForProcessing(){
    if (processingPromise) {
        await processingPromise;
    }
}


