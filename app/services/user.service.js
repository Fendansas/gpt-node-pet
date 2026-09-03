import userRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import {ConflictError} from "../errors/ConflictError.js";
import {Unauthorized} from "../errors/Unauthorized.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";
import {ValidationError} from "../errors/ValidationError.js";
import {userResponse} from "../utils/userResponse.js";

class UserService {

    async getUsers(){
        const users = await userRepository.getUsers()
        return users.map(user => userResponse(user));
    }

    async createUser(data){
        const existUser = await userRepository.getUserByEmail(data.email);

        if (existUser){
            throw new ConflictError('Email already exists');
        }

        const hash = await bcrypt.hash(data.password, 10);

        data.password = hash;

        const user = await userRepository.createUser(data);

        return userResponse(user);

    }

    async loginUser(data) {
        const user = await userRepository.getUserByEmailWithPassword(data.email);

        if (!user){
            throw new NotFoundError('Not found user');
        }

        if(user.isActive === false){
            throw new ForbiddenError('Forbidden');
        }

        const password = data.password;

        const comparePass = await bcrypt.compare(password, user.password);
        if (comparePass === false){
            throw new Unauthorized('Unauthorized');
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )


        return {
            user: userResponse(user),
            token
        };
    }

    async getUserById(id) {

        const user = await userRepository.getUserById(id)
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return userResponse(user)

    }
    async updateUser(id, data){
        const user = await userRepository.getUserById(id)
        if (!user) {
            throw new NotFoundError('User not found');
        }


        const updateData = {};
        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        if(data.email !== undefined){

            let checkEmail = await userRepository.getUserByEmail(data.email);
            if (checkEmail && checkEmail._id.toString() !== id) {
                throw new ConflictError('Email already exists');
            }
            updateData.email = data.email

        }

        if (Object.keys(updateData).length === 0) {
            throw new ValidationError('No data');
        }

        const updatedUser = await userRepository.updateUser(id, updateData)

        return userResponse(updatedUser);

    }
    async deactivateUser(id) {
        const user = await userRepository.getUserById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const deactivatedUser = await userRepository.deactivateUser(id);

        return userResponse(deactivatedUser);
    }

    async activateUser(id) {
        const user = await userRepository.getUserById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const activatedUser = await userRepository.activateUser(id);

        return userResponse(activatedUser);
    }
}

export default new UserService();