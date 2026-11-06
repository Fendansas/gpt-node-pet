

export const buildTaskChanges = (task, updateData) => {
    const changes = {};

    for (const key in updateData) {
            if(!(key in task)){
                continue
            }
            let isChanged;

            if (key === 'assignedTo'){
                if(task.assignedTo === null && updateData.assignedTo === null){
                    isChanged = false
                } else{
                    isChanged = String(task.assignedTo) !== String(updateData.assignedTo);

                }


            } else if (key === 'dueDate') {
                if (!task.dueDate && !updateData.dueDate) {
                    isChanged = false;
                }else if (!task.dueDate || !updateData.dueDate) {
                    isChanged = true;
                } else{
                    isChanged = task.dueDate.getTime() !== updateData.dueDate.getTime();
                }

            } else {
                isChanged = task[key] !== updateData[key];
            }

            if (isChanged) {
                changes[key] = {
                    from: task[key],
                    to: updateData[key]
                };
            }


    }

    return changes;
};