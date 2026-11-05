import Comment from "../models/comment.model.js";

class CommentRepository{

    async createComment(data, session) {

            const comment = await Comment.create([{
                text: data.text,
                author: data.author,
                taskId: data.taskId
            }],{session})
        return comment[0];

    }

    async getCommentsByTaskId(taskId) {
         const comments = await Comment.find({taskId: taskId}).sort({ createdAt: 1 });
        return comments;
    }

    async getCommentById(id) {
       const comment = await Comment.findById(id);
       return comment
    }



}


export default new CommentRepository();