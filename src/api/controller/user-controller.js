import { listAllUsers, findUserById, findUserByUsername, addUser, updateUser, removeUser } from '../model/user-model.js';
import bcrypt from 'bcrypt';
import promisePool from '../../utils/database.js';


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
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        } else {
            throw new Error('Salasana puuttuu');
        }

        const result = await addUser(req.body);
        if (!result) {
            throw new Error('Käyttäjän lisääminen epäonnistui');
        }

        res.status(201).json(result);

    } catch (error) {
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

        res.status(200).json({ message: 'Kirjautuminen onnistui', user_id: user.id });

    } catch (error) {
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