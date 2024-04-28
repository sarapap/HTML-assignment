import { listAllUsers, findUserById, findUserByUsername, addUser, updateUser, removeUser } from '../model/user-model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import promisePool from '../../utils/database.js';
import config from '../../config/config.js';

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

const SECRET_KEY = config.SECRET_KEY;

const postUser = async (req, res) => {
    try {
        const { name, lastname, username, password, email, phone } = req.body;

        if (!req.body.password) {
            throw new Error('Salasana puuttuu');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await addUser({ name, lastname, username, password: hashedPassword, email, phone });

        if (!newUser) {
            throw new Error('Käyttäjän lisääminen epäonnistui');
        }

        const token = jwt.sign(
            { user_id: newUser.user_id, username: username },
            SECRET_KEY,
        );

        res.status(201).json({ success: true, token, user_id: newUser.user_id });

    } catch (error) {
        console.error('Virhe postUser-toiminnossa:', error.message);
        res.status(400).json({ error: error.message });
    }
};

const userLoginPost = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error('Käyttäjätunnus ja salasana ovat pakollisia');
        }

        const sql = 'SELECT * FROM kayttaja WHERE username = ?';
        const [rows] = await promisePool.execute(sql, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Väärä käyttäjätunnus tai salasana' });
        }

        const user = rows[0];

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Väärä käyttäjätunnus tai salasana' });
        }

        const token = jwt.sign(
            { user_id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Kirjautuminen onnistui', token, user_id: user.id });

    } catch (error) {
        console.error('Virhe kirjautumisessa:', error.message);
        res.status(400).json({ error: error.message });
    }
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


export { userLoginPost, getUser, getUserByUsername, getUserById, postUser, putUser, deleteUser };
