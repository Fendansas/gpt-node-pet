import mongoose from 'mongoose';

const { Schema } = mongoose;

const outboxSchema = new Schema({
    eventType:{
        type: String,
        required: true
    },
    payload:{
        type: Schema.Types.Mixed,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'processed'],
        default: 'pending'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    processedAt:{
        type: Date,
        default: null
    }

})

const Outbox = mongoose.model('Outbox', outboxSchema)

export default Outbox;