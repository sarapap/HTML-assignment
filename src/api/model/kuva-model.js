import promisePool from '../../utils/database.js';

const addKuva = async (kayttajaKuva, file) => {
    const kuvaPolku = file?.path ?? null;

    if (!kuvaPolku) {
        console.error("Tiedoston polkua ei löydy.");
        return false;
    }

    const sql = `INSERT INTO kayttaja (kayttaja_kuva) VALUES (?)`;

    try {
        const [rows] = await promisePool.execute(sql, [kuvaPolku]);
        if (rows.affectedRows === 0) {
            return false;
        }
        return { kuva_id: rows.insertId };
    } catch (error) {
        console.error("SQL-virhe:", error);
        return false;
    }
};


const listKuvat = async () => {
    const [rows] = await promisePool.query('SELECT * FROM kayttajaKuva');
    return rows;
};

const findKuvaById = async (kuva_id) => {
    if (typeof kuva_id === 'undefined') {
        throw new Error("kuva_id is undefined");
    }

    const [rows] = await promisePool.execute(
        'SELECT * FROM kayttajaKuva WHERE kuva_id = ?',
        [kuva_id]
    );

    if (rows.length === 0) {
        return false;
    }

    return rows[0];
};

const findKuvaByname = async (kuva_nimi) => {
    const [rows] = await promisePool.execute(
        'SELECT * FROM kayttajaKuva WHERE kuva_nimi = ?',
        [kuva_nimi]
    );
    if (rows.length === 0) {
        return false;
    }
    return rows;
};


const removeKuvaById = async (kuvaId) => {
    if (!kuvaId) {
        console.error("Kuva_id puuttuu.");
        return false;
    }

    const connection = await promisePool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await promisePool.execute(
            'DELETE FROM kayttajaKuva WHERE kuva_id = ?',
            [kuvaId]
        );

        if (rows.affectedRows === 0) {
            return false;
        }

        await connection.commit();
        return { message: 'Kuva poistettu' };
    } catch (error) {
        await connection.rollback();
        console.error('SQL error:', error.message);
        return false;
    } finally {
        connection.release();
    }
};

const updateKuva = async (kuva, file, kuva_id) => {
    const sql = promisePool.format(`UPDATE kayttajaKuva SET ? WHERE kuva_id = ?`, [
        kuva,
        file,
        kuva_id,
    ]);
    try {
        const rows = await promisePool.execute(sql);
        console.log('updatetuote', rows);
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
    addKuva,
    listKuvat,
    findKuvaById,
    findKuvaByname,
    removeKuvaById,
    updateKuva,
};