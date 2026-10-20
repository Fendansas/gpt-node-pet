import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({

    taskId:{
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        trim: true,
        minlength: [2, 'The message must contain at least 2 characters'],
        required: true
    },

},{
    timestamps: true
});


const Comment = mongoose.model('Comment', commentSchema)

export default Comment;