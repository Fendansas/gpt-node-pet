const taskStatusPermissions = {
    'draft:backlog': ['creator', 'admin'],
    'backlog:todo': ['creator', 'admin'],

    'todo:in_progress': ['assignee', 'admin'],
    'in_progress:review': ['assignee', 'admin'],
    'rework:in_progress': ['assignee', 'admin'],

    'review:done': ['creator', 'admin'],
    'review:rework': ['creator', 'admin'],
};

const canChangeStatus = (task, user, currentStatus, newStatus)=>{
    const permission = taskStatusPermissions[`${currentStatus}:${newStatus}`];

    if (!permission){
        return false;
    }

    if(user.role === 'admin'){
        return permission.includes('admin');
    }

    const userId = user.userId.toString();

    const isCreator = task.createdBy.toString() === userId;

    const isAssignee = task.assignedTo && task.assignedTo.toString() === userId;

    if(isCreator && permission.includes('creator')){
        return true
    }

    if (isAssignee && permission.includes('assignee')){
        return true
    }

    return false



}

export { taskStatusPermissions, canChangeStatus };