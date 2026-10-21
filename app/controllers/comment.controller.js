
import commentService from "../services/comment.service.js";

class CommentController {
    async createComment(req, res, next) {
        const data = {
            ...req.body,
            taskId: req.params.taskId
        };

        const comment = await commentService.createComment(data, req.user)
        return res.status(201).json(comment)

    }

    async getCommentsByTaskId(req, res, next){
        const taskId = req.params.taskId
        const user = req.user
        const comments = await commentService.getCommentsByTaskId(taskId, user)

        return res.status(200).json(comments);
    }
}
export default new CommentController();