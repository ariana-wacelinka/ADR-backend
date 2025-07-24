const express = require("express");
const app = express();
const bodyParser = require('body-parser')

require('dotenv').config()

const Pool = require('pg').Pool
const connectionString = process.env.DB
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}))

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

const getAllAnnouncements = (request, response) => {
    pool.query('SELECT * FROM announcements', (error, results) => {
        if (error) {
            console.error('Error al obtener anuncios:', error);
            response.status(500).json({ error: 'Error al obtener los anuncios' });
        } else {
            console.log('Anuncios obtenidos:', results.rows);
            response.status(200).json(results.rows);
        }
    });
};


const createAnnouncement = (request, response) => {
    const { title, description, date } = request.body;
    console.log("Datos recibidos en el POST:", request.body);

    pool.query('INSERT INTO announcements (title, description, date) VALUES ($1, $2, $3)', [title, description, date], (error, results) => {
        if (error) {
            console.error('Error al crear anuncio:', error);
            response.status(500).json({ error: 'Error al crear el anuncio' });
        } else {
            console.log('Anuncio creado:', { title, description, date });
            response.status(201).json({ AnnouncementCreated: 'Ok' });
        }
    });
};

app.get('/', function (req, res) {
    res.json({Result: ''})
});

app.get('/announcements', getAllAnnouncements)
app.post('/announcements', createAnnouncement)

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log("http://localhost:%d", port);
});