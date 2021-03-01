const express = require('express');
const busboyBodyParser =  require('busboy-body-parser');
const fileController = require('../controllers/file.controller');

const app = express();

app.use(busboyBodyParser());

app.get('/', function (req, res) {
    res.status(200).send('Welcome to the upload csv api');
});

app.post('/upload-csv', fileController.fileUpload);

module.exports = app;
