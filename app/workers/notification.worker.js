import {Worker} from "bullmq";



const worker = new Worker(
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

worker.on('completed', (job) => {
    console.log('completed',job.id )

});

worker.on('failed', (job, error) =>{
    console.log('failed', job?.data, error.message);
})

export default worker