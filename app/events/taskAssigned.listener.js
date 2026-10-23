import emitter from './eventEmitter.js'


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