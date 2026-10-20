import Comment from "../models/comment.model.js";

class CommentRepository{

    async createComment(data) {

            const comment = await Comment.create({
                text: data.text,
                author: data.author,
                taskId: data.taskId
            })
            return comment;

    }

    async getCommentsByTaskId(taskId) {
         const comments = await Comment.find({taskId: taskId}).sort({ createdAt: 1 });
        return comments;
    }



}


export default new CommentRepository();