import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
    const [rows] = await promisePool.query('SELECT * FROM kayttaja');
    return rows;
};

const findUserById = async (id) => {
    const [rows] = await promisePool.execute(
        'SELECT * FROM kayttaja WHERE user_id = ?',
        [id]
    );
    if (rows.length === 0) {
        return false;
    }
    return rows[0];
};

const addUser = async (user) => {
    const {
        name,
        lastname,
        username,
        password,
        email,
        phone,
    } = user;


    const sql = `INSERT INTO kayttaja (name, lastname, username, password,
      email, phone)
      VALUES (?, ?, ?, ?, ?, ?)`;

    const data = [
        name,
        lastname,
        username,
        password,
        email,
        phone,
    ];
    try {
        const [rows] = await promisePool.execute(sql, data);
        if (rows && rows.affectedRows !== 0) {
            return { user_id: rows.insertId };
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        return false;
    }

};

const findUserByUsername = async (tunnus) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM kayttaja WHERE tunnus = ?',
            [tunnus]
        );
        if (rows.length === 0) {
            return false;
        }
        return rows[0];
    } catch (error) {
        console.error('Error finding user by username:', error);
        return false;
    }
};



const removeUser = async (id) => {
    const connection = await promisePool.getConnection();
    try {
        const [rows] = await promisePool.execute(
            'DELETE FROM kayttaja WHERE user_id = ?',
            [id]
        );

        if (rows.affectedRows === 0) {
            return false;
        }

        await connection.commit();

        return {
            message: 'User deleted',
        };
    } catch (error) {
        await connection.rollback();
        console.error('error', error.message);
        return false;
    } finally {
        connection.release();
    }
};

const updateUser = async (user, asiakas_id) => {
    const sql = promisePool.format(`UPDATE kayttaja SET ? WHERE user_id = ?`, [
        user,
        asiakas_id,
    ]);

    try {
        const rows = await promisePool.execute(sql);
        console.log('updateUser', rows);
        if (rows.affectedRows === 0) {
            return false;
        }
        return { message: 'success' };
    } catch (e) {
        console.error('error', e.message);
        return false;
    }
};

export {
    listAllUsers,
    findUserById,
    addUser,
    findUserByUsername,
    removeUser,
    updateUser,
};