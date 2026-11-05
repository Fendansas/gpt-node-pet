import commentRepository from "../repositories/comment.repository.js";
import taskRepository from "../repositories/task.repository.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";
import mongoose from "mongoose";
import outboxRepository from "../repositories/outbox.repository.js";


class CommentService{
    async createComment(data, user){

        const task = await taskRepository.getTaskById(data.taskId)

        if (!task){
            throw new NotFoundError('Task not found');
        }
        this.checkTaskAccess(task, user)

        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const comment = await commentRepository.createComment({
                taskId: data.taskId,
                text: data.text,
                author: user.userId

            }, session)


            const recipients = [
                ...new Set(
                    [task.createdBy, task.assignedTo]
                        .filter(id => id && id.toString() !== user.userId.toString())
                        .map(id => id.toString())
                )
            ];

            for (const recipientId of recipients) {
                console.log(recipientId);
                await outboxRepository.create({
                        eventType: 'task.comment.created',
                        payload: {
                            taskId: data.taskId,
                            commentId: comment._id,
                            recipientId: recipientId,
                            authorId: user.userId
                        },
                        status: 'pending'
                    }, session
                );
            }

            await session.commitTransaction();
            return comment
        } catch (error){
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }

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