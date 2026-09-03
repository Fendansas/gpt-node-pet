import userService from "../services/user.service.js";


class UserController {

    async getUsers(req, res, next) {

        const users = await userService.getUsers();
        res.json(users);

    }

    async createUser(req, res, next) {
        const user = await userService.createUser(req.body)
        res.status(201).json(user)
    }

    async loginUser(req, res, next) {
        const user = await userService.loginUser(req.body)
        res.status(200).json(user)
    }

    async getMe(req, res, next) {

        const user = await userService.getUserById(req.user.userId);
        res.status(200).json(user)

    }

    async updateMe(req, res, next) {
        const updatedUser = await userService.updateUser(
            req.user.userId,
            req.body
        );
        res.status(200).json(updatedUser);
    }

    async deleteMe(req, res, next) {
        await userService.deactivateUser(req.user.userId)
        return res.status(204).send()
    }

    async deactivateUser(req, res, next) {

        await userService.deactivateUser(req.params.id)
        return res.status(204).send()
    }

    async activateUser(req, res, next) {

        const user = await userService.activateUser(req.params.id);
        return res.status(200).json(user)

    }

}

export default new UserController;