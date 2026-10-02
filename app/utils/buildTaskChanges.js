

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