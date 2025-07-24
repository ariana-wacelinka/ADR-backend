require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
module.exports = app; // si lo usás en tests, mantenelo

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true })); // reemplaza tu middleware manual

// ---------- Pool MySQL ----------
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456',
    database: process.env.MYSQL_DB || 'adrdb',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de conexión
(async () => {
    try {
        const [rows] = await pool.query('SELECT NOW() AS now');
        console.log('Conexión exitosa a MySQL. Hora actual:', rows[0].now);
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    }
})();

// ---------- Handlers ----------
const getAllAnnouncements = async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM announcements');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener anuncios:', error);
        res.status(500).json({ error: 'Error al obtener anuncios' });
    }
};

const createAnnouncement = async (req, res) => {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO announcements (title, description, date) VALUES (?, ?, ?)',
            [title, description, dateObject]
        );
        const [inserted] = await pool.query('SELECT * FROM announcements WHERE id = ?', [result.insertId]);

        res.status(201).json({
            message: 'Anuncio creado correctamente',
            announcement: inserted[0]
        });
    } catch (error) {
        console.error('Error al crear anuncio:', error.message);
        res.status(500).json({ error: 'Error al crear anuncio: ' + error.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    const { id } = req.body;
    console.log('Announcement to delete:', id);

    if (!id) return res.status(400).json({ error: 'ID es requerido' });

    try {
        const [result] = await pool.query('DELETE FROM announcements WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }
        res.status(200).json({ message: 'Anuncio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar anuncio:', error);
        res.status(500).json({ error: 'Error al eliminar el anuncio: ' + error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    const id = req.params.id;
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE announcements SET title = ?, description = ?, date = ? WHERE id = ?',
            [title, description, dateObject, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }

        const [updated] = await pool.query('SELECT * FROM announcements WHERE id = ?', [id]);

        res.status(200).json({
            message: 'Anuncio actualizado correctamente',
            announcement: updated[0]
        });
    } catch (error) {
        console.error('Error al actualizar anuncio:', error);
        res.status(500).json({ error: 'Error al actualizar anuncio: ' + error.message });
    }
};

// ---------- Rutas ----------
app.delete('/announcements', deleteAnnouncement);
app.get('/announcements', getAllAnnouncements);
app.post('/announcements', createAnnouncement);
app.put('/announcements/:id', updateAnnouncement);

// Escucha (descomenta si lo corrés standalone)
//// const port = process.env.PORT || 1337;
//// app.listen(port, () => {
////   console.log(`Servidor corriendo en http://localhost:${port}`);
//// });
