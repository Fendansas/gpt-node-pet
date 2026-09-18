const taskStatusTransitions = {

    draft:['backlog'],
    backlog: ['todo'],
    todo:['in_progress'],
    in_progress: ['review'],
    review: ['done', 'rework'],
    rework:['in_progress'],
    done:[],
    cancelled:[]
}

const canTransition = (currentStatus, newStatus) =>
    taskStatusTransitions[currentStatus].includes(newStatus);



export { taskStatusTransitions, canTransition };