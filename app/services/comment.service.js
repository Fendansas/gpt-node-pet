import commentRepository from "../repositories/comment.repository.js";
import taskRepository from "../repositories/task.repository.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";


class CommentService{
    async createComment(data, user){

        const task = await taskRepository.getTaskById(data.taskId)

        if (!task){
            throw new NotFoundError('Task not found');
        }
        this.checkTaskAccess(task, user)


        const comment = await commentRepository.createComment({
            taskId: data.taskId,
            text: data.text,
            author: user.userId

        })
        return comment
    }

    async getCommentsByTaskId(taskId,user){
        const task = await taskRepository.getTaskById(taskId)

        if (!task){
            throw new NotFoundError('Task not found');
        }

        this.checkTaskAccess(task, user)

        const comments = await commentRepository.getCommentsByTaskId(taskId)
        return comments

    }

    checkTaskAccess(task, user){

        if(user.role === 'admin'){
            return
        }
        if (user.userId.toString() === task.createdBy.toString()){
            return
        }
        if (task.assignedTo && user.userId.toString() === task.assignedTo.toString()){
            return
        }

        throw new ForbiddenError('Forbidden');


    }
}

export default new CommentService();