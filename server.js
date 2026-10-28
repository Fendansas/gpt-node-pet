import connectDB, { disconnectDB } from "./app/config/database.js";
import dotenv from 'dotenv';
import app from './app.js'
import './app/events/taskAssigned.listener.js';
import worker from "./app/workers/notification.worker.js";
import queue from "./app/queues/notification.queue.js";

const port = 3333;

dotenv.config()

await connectDB();

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
    if (isShuttingDown === true){
        return
    }
    isShuttingDown = true
    let hasError = false
    console.log('Received', signal);
    try {
        await closeServer()
    } catch (error) {
        console.log(error)
        hasError = true
    }

    try {
        await worker.close();
    } catch (error) {
        console.log(error)
        hasError = true
    }

    try {
        await queue.close()
    } catch (error) {
        console.log(error)
        hasError = true
    }

    try {
        await disconnectDB()
    } catch (error) {
        console.log(error)
        hasError = true
    }

    process.exitCode = hasError ? 1 : 0;

}

