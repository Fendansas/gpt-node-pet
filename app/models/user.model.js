import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true,
        select: false
    },
    role:{
        type: String,
        default: 'user'
    },
    isActive:{
        type:Boolean,
        default: true
    },
    tokenVersion:{
        type: Number,
        default: 0
    }
})

const User = mongoose.model('User', userSchema)

export default User;