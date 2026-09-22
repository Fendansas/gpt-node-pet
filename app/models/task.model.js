import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({

    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'backlog', 'todo', 'in_progress', 'review', 'rework', 'done', 'cancelled'],
        default: 'draft'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});
taskSchema.index({
    createdBy: 1,
    status: 1,
    createdAt: -1
});

taskSchema.index({
    assignedTo: 1,
    status: 1,
    createdAt: -1
})

const Task = mongoose.model('Task', taskSchema)

export default Task;