import express from 'express';
import {
    getUser,
    getUserById,
    getUserByUsername,
    postUser,
    putUser,
    userLoginPost,
    getUserInfo,
    updatePasswordController,
} from '../controller/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);
userRouter.route('/info/:id').get(getUserInfo).put(putUser);
userRouter.route('/login').post(userLoginPost);

userRouter.route('/:id').get(getUserById).put(putUser);
userRouter.route('/name/:tunnus').get(getUserByUsername);
userRouter.route('/password/:id').put(updatePasswordController);

export default userRouter;