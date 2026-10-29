import {Worker, UnrecoverableError } from "bullmq";



async function sendEmail(job) {

        console.log('Email sent')
}


const worker = new Worker(
    'notifications',
    async (job) => {


        try {
            await sendEmail(job)

        } catch (error){
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
    console.log('completed',job.id )

});

worker.on('failed', (job, error) =>{
    console.log('failed', job?.data, error.message);
})

export default worker