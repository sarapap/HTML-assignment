import {
    addKuva,
    listKuvat,
    findKuvaById,
    findKuvaByname,
    removeKuvaById,
    updateKuva
} from '../model/kuva-model.js';

const postKuva = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error("Tiedostoa ei löytynyt.");
        }

        const result = await addKuva(req.body, req.file);
        if (!result) {
            throw new Error("Kuvan lisääminen epäonnistui.");
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Virhe postKuvassa:", error);
        res.status(500).json({ error: "Jotain meni pieleen" });
    }
};

const getKuva = async (req, res) => {
    const kuva = await listKuvat();
    if (!kuva) {
        res.sendStatus(404);
        return;
    } res
    res.json(kuva);
};

const putKuva = async (req, res) => {
    try {
        console.log("PUT-req.file:", req.file);
        if (!req.file) {
            throw new Error("Tiedosto puuttuu.");
        }

        const data = {
            kuva_nimi: req.body.kuva_nimi,
            kuva: req.file.filename,
        };

        console.log("PUT-data:", data);

        const result = await updateKuva(data, req.params.id);

        if (!result) {
            throw new Error("Kuvan päivittäminen epäonnistui.");
        }

        res.status(200).json({ message: "Kuva päivitetty onnistuneesti." });
    } catch (error) {
        console.error("Virhe putKuvassa:", error.message);
        res.status(500).json({ error: "Jotain meni pieleen." });
    }
};

const deleteKuva = async (req, res) => {
    const kuvaId = req.params.id;

    if (!kuvaId) {
        res.status(400).json({ error: "Kuva_id puuttuu." });
        return;
    }

    try {
        const result = await removeKuvaById(kuvaId);

        if (!result) {
            res.status(400).json({ error: "Kuvan poistaminen epäonnistui." });
            return;
        }

        res.status(200).json({ message: "Kuva poistettu onnistuneesti." });
    } catch (error) {
        res.status(500).json({ error: "Jotain meni pieleen. Yritä myöhemmin uudelleen." });
        console.error("deleteKuva error:", error.message);
    }
};


const getKuvaByName = async (req, res) => {
    const kuva = await findKuvaByname(req.params.kuva_nimi);
    if (kuva) {
        res.json(kuva);
    } else {
        res.sendStatus(404);
    }
}

const getKuvaById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Invalid or missing ID." });
        return;
    }

    const kuva = await findKuvaById(id);

    if (kuva) {
        res.json(kuva);
    } else {
        res.status(404).json({ error: "Kuvaa ei löytynyt." });
    }
};



export {
    postKuva,
    getKuva,
    putKuva,
    deleteKuva,
    getKuvaByName,
    getKuvaById
};