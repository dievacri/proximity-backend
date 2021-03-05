const express = require('express');
const busboyBodyParser =  require('busboy-body-parser');
const fileController = require('../controllers/file.controller');
/** express server */
const app = express();
/** add to server the multipart option */
app.use(busboyBodyParser());

app.get('/', function (req, res) {
    res.status(200).send('Welcome to the upload csv api');
});
/**
 * API POST /upload-csv
 * @param {File} file - The csv file to be upload
 * @param {String} company - the company to check his configuration column
 * */
app.post('/upload-csv', fileController.fileUpload);

module.exports = app;
