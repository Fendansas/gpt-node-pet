import {Worker, UnrecoverableError} from "bullmq";
import userService from "../services/user.service.js";
import {sendEmail as sendEmailMailer} from "../services/email.service.js";
import {NotFoundError} from "../errors/NotFoundError.js";

import taskRepository from "../repositories/task.repository.js";

async function sendEmail(job) {

    const user = await userService.getUserById(job.data.assignedTo)
    if (!user.email) {
        throw new UnrecoverableError('User email not found');
    }
    const assignedBy = await userService.getUserById(job.data.assignedBy);
    if (!assignedBy.name) {
        throw new UnrecoverableError('User name not found');
    }
    const task = await taskRepository.getTaskById(job.data.taskId);
    if (!task) {
        throw new UnrecoverableError('Task not found');
    }
    const emailData = {
        to: user.email,
        subject: `You have been assigned a task from ${assignedBy.name}`,
        text: `Task ${task.title} , priority ${task.priority}`
    }
    await sendEmailMailer(emailData)

    console.log('Email sent')
}


const worker = new Worker(
    'notifications',
    async (job) => {
        try {
            await sendEmail(job)

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new UnrecoverableError('User not found');
            }

            switch (error.code) {
                case "INVALID_EMAIL":
                    throw new UnrecoverableError('Invalid email');
                case "TIMEOUT":
                    throw error

                default:
                    throw error;
            }
        }

    },
    {
        connection: {
            host: '127.0.0.1',
            port: 6379
        }
    }
);

worker.on('completed', (job) => {
    console.log('completed', job.id)

});

worker.on('failed', (job, error) => {
    console.log('failed', job?.data, error.message);
})

export default worker