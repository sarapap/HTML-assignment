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
    putUserPic,
    getUserPic
} from '../controller/user-controller.js';

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.png');
    },
});

const upload = multer({ storage });

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);
userRouter.route('/info/:id').get(getUserInfo).put(putUser);
userRouter.route('/login').post(userLoginPost);

userRouter.route('/:id').get(getUserById).put(putUser);
userRouter.route('/name/:tunnus').get(getUserByUsername);
userRouter.route('/password/:id').put(updatePasswordController);
userRouter.route('/avatar/:id').put(upload.single('kuva'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Tiedostoa ei löydy." });
    }
    putUserPic(req, res, next);
});
userRouter.route('/avatar/:id').get(getUserPic);

export default userRouter;