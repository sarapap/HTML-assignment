import express from 'express';
import {
    getUser,
    getUserById,
    getUserByUsername,
    postUser,
    putUser,
    deleteUser,
    userLoginPost,
} from '../controller/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);
userRouter.route('/login').post(userLoginPost);

userRouter.route('/:id').get(getUserById).put(putUser).delete(deleteUser);
userRouter.route('/name/:tunnus').get(getUserByUsername);

export default userRouter;