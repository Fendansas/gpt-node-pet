import User from '../models/user.model.js'
import {ConflictError} from "../errors/ConflictError.js";

class UserRepository {
    async getUsers() {
        return User.find();
    }

    async createUser(data) {
        try {
            const user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password
            })
            return user;
        } catch (error){
            if (error.code === 11000){
                throw new ConflictError('Email already exists');
            }
            throw error;
        }

    }

    async getUserByEmail(email) {
        return User.findOne({email});
    }

    async getUserByEmailWithPassword(email) {
        return User.findOne({ email }).select('+password');
    }

    async getUserById(id) {
        return User.findById(id);
    }

    async updateUser(id, data) {
        try {
            const user = await User.findByIdAndUpdate(
                id,
                data,
                {
                    new: true,
                    runValidators: true
                })
            return user
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictError('Email already exists');
            }
            throw error;
        }
    }


    async deactivateUser(id) {
        return User.findByIdAndUpdate(id,
            {isActive: false},
            {new: true}
        )
    }

    async activateUser(id) {
        return User.findByIdAndUpdate(id,
            {isActive: true},
            {new: true}
        )
    }
}

export default new UserRepository();