import { listAllUsers, findUserById, findUserByUsername, addUser, updateUser, removeUser } from '../models/user-model.js';
import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
    const users = await listAllUsers();
    if (!users) {
        res.sendStatus(404);
        return;
    } res
    res.json(users);
};


const getUserByUsername = async (req, res) => {
    const user = await findUserByUsername(req.params.tunnus);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
}

const getUserById = async (req, res) => {
    const user = await findUserById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
};

const postUser = async (req, res) => {
    console.log(req.body);
    req.body.salasana = bcrypt.hashSync(req.body.salasana, 10);
    req.body.ehdot_hyvaksytty = req.body.ehdot_hyvaksytty ? 1 : 0;

    const result = await addUser(req.body);
    if (!result) {
        const error = new Error('Invalid or missing fields.');
        error.status = 400;
        return
    }
    res.status(201).json(result);
};


const putUser = async (req, res) => {
    // if (
    //     res.locals.user.user_id !== Number(req.params.asiakas_id) &&
    //     res.locals.user.role !== 'admin'
    // ) {
    //     res.sendStatus(403);
    //     return;
    // }

    const result = await updateUser(req.body, req.params.asiakas_id, res.locals.user);
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.json(result);
};

const deleteUser = async (req, res) => {
    if (
        res.locals.user.user_id !== Number(req.params.id) &&
        res.locals.user.role !== 'admin'
    ) {
        res.sendStatus(403);
        return;
    }
    const result = await removeUser(req.params.id);
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.json(result);
};


export { getUser, getUserByUsername, getUserById, postUser, putUser, deleteUser };