import {
    listAllUsers,
    findUserById,
    findUserByUsername,
    findUserByTunnus,
    addUser,
    updateUser,
    updateUserPassword,
    findUserPic
} from '../model/user-model.js';
import bcrypt from 'bcrypt';
import { checkPassword } from '../../utils/salasana.js';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
const SECRET_KEY = config.SECRET_KEY;


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
        const {
            name,
            lastname,
            username,
            password,
            email,
            phone,
        } = req.body;

        const requiredFields = ["name", "lastname", "username", "password", "email", "phone"];
        const missingFields = requiredFields.filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            throw new Error(`Puuttuvat kentät: ${missingFields.join(", ")}`);
        }

        const result = await addUser({
            name,
            lastname,
            username,
            password: bcrypt.hashSync(password, 10),
            email,
            phone,
        });

        if (!result) {
            throw new Error("Käyttäjän lisääminen epäonnistui");
        }

        const token = jwt.sign(
            {
                user_id: result.user_id,
                username: username,
            },
            SECRET_KEY
        );

        res.status(201).json({ success: true, token, user_id: result.user_id });
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

        const user = await findUserByTunnus(username);

        if (!user) {
            return res.status(401).json({ error: 'Väärä käyttäjätunnus tai salasana' });
        }

        const passwordMatch = checkPassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Väärä käyttäjätunnus tai salasana' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Kirjautuminen onnistui', token, user_id: user.user_id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};


const putUser = async (req, res) => {
    try {
        const user_id = req.params.id;

        const updatedFields = {
            name: req.body.name || null,
            lastname: req.body.lastname || null,
            username: req.body.username || null,
            password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : null,
            email: req.body.email || null,
            phone: req.body.phone || null,
        };

        const sanitizedFields = Object.fromEntries(
            Object.entries(updatedFields).filter(([, value]) => value !== null)
        );

        const result = await updateUser(sanitizedFields, user_id);

        if (!result) {
            res.status(400).send('Päivitys epäonnistui');
            return;
        }

        res.json(result);
    } catch (error) {
        res.status(500).send('Sisäinen palvelinvirhe');
    }
};


const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await findUserById(userId);

        if (!userData) {
            return res.status(404).json({ error: "Käyttäjää ei löydy." });
        }

        res.status(200).json({
            nimi: `${userData.name} ${userData.lastname}`,
            tunnus: userData.username,
            email: userData.email,
            puhelin: userData.phone,
        });

    } catch (error) {
        res.status(500).json({ error: "Virhe palvelimella." });
    }
};


const updatePasswordController = async (req, res) => {
    try {
        const newPassword = req.body.salasana;

        if (!newPassword) {
            return res.status(400).send("Uusi salasana on pakollinen.");
        }

        const user = await findUserById(req.params.id);

        if (!user) {
            return res.status(404).send("Käyttäjää ei löydy.");
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        const result = await updateUserPassword(req.params.id, hashedNewPassword);

        if (!result) {
            return res.status(400).send("Salasanan päivitys epäonnistui.");
        }

        return res.status(200).send("Salasana päivitetty.");

    } catch (error) {
        return res.status(500).send("palvelinvirhe.");
    }
};


const putUserPic = async (req, res) => {
    try {
        const user_id = req.params.id;

        console.log('user', user_id)
        console.log('req.file:', req.file)
        if (!req.file) {
            return res.status(400).send('Kuvaa ei lähetetty.');
        }

        const updatedFields = {
            kayttaja_kuva: req.file.filename,
        };

        const result = await updateUser(updatedFields, user_id);

        if (!result) {
            return res.status(400).send('Profiilikuvan päivitys epäonnistui.');
        }

        return res.json(result);
    } catch (error) {
        console.error('Virhe profiilikuvan päivittämisessä:', error);
        return res.status(500).send('Sisäinen palvelinvirhe');
    }
};


const getUserPic = async (req, res) => {
    try {
        const userID = req.params.id;

        console.log('userID:', userID);
        const userPic = await findUserPic(userID);

        console.log('userPic:', userPic)
        if (!userPic) {
            return res.status(404).json({ error: "Käyttäjän profiilikuvaa ei löytynyt." });
        }

        return res.json({ userPic: userPic });
    } catch (error) {
        console.error('Virhe getUserPicControllerissa:', error.message);
        return res.status(500).json({ error: "Sisäinen palvelinvirhe." });
    }
};


export {
    userLoginPost,
    getUser,
    getUserByUsername,
    getUserById,
    postUser,
    putUser,
    getUserInfo,
    updatePasswordController,
    putUserPic,
    getUserPic
};
