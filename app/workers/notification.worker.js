import {Worker} from "bullmq";


new Worker(
    'notifications',
    async (job) => {
        console.log(job.name, job.data)
    },
    {
        connection: {
            host: '127.0.0.1',
            port: 6379
        }
    }
);