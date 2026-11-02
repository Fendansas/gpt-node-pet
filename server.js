import connectDB, {disconnectDB} from "./app/config/database.js";
import dotenv from 'dotenv';
import app from './app.js'
import worker from "./app/workers/notification.worker.js";
import queue from "./app/queues/notification.queue.js";
import {processPending, waitForProcessing} from "./app/services/outboxProcessor.service.js";

const port = 3333;

dotenv.config()


await connectDB();

await processPending();
const processorTimer = setInterval(async () => {
    try {
        await processPending()
    } catch (error) {
        console.log(error)
    }

}, 5000)


let isShuttingDown = false
const server = app.listen(port, () => {
    console.log(`Server start on port ${port}`)
})


function closeServer() {
    return new Promise((resolve, reject) => {
        server.close((error) => {
            if (!error) {
                resolve("Server off");
            } else {
                reject(error)
            }
        });
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'))

async function shutdown(signal) {

    if (isShuttingDown === true) {
        return
    }
    isShuttingDown = true
    let hasError = false
    clearInterval(processorTimer);
    try {
        console.log('Closing HTTP server')
        await closeServer()
    } catch (error) {

        console.error('Error closing HTTP server:', error);
        hasError = true
    }
    try {
        console.log('Waiting for Outbox');
        await waitForProcessing();
    } catch (error) {

        console.error('Error waiting for Outbox:', error);
        hasError = true
    }

    try {
        console.log('Closing Worker');
        await worker.close();
    } catch (error) {

        console.error('Error closing Worker:', error);
        hasError = true
    }


    console.log('Received', signal);


    try {
        console.log('Closing Queue');
        await queue.close()
    } catch (error) {

        console.error('Error closing Queue:', error);
        hasError = true
    }

    try {
        console.log('Disconnecting MongoDB');
        await disconnectDB()
    } catch (error) {

        console.error('Error disconnecting MongoDB:', error);
        hasError = true
    }
    console.log('Shutdown hasError:', hasError);
    process.exitCode = hasError ? 1 : 0;

}

