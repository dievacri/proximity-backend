const csv = require('csvtojson');
const {fileModel} = require('../models/File');
const {columns} = require('../constants/columns.js');
/**
 * Funtion to upload a csv file
 * */
exports.fileUpload = (req, res) => {
    /**
     * Check if in payload exists files
     * */
    if (!req.files) return res.status(400).json({
        'msg': "parameter file is missing"
    });
    /**
     * Check the parameter 'file' exists
     * */
    if (!req.files.file) return res.status(400).json({
        'msg': "parameter file is missing"
    });
    /**
     * Check if file is a csv
     * */
    if (req.files.file.mimetype !== 'text/csv') return res.status(400).json({
        'msg': "parameter file has to be .csv"
    });

    const {company} = req.body;
    /**
     * Check if in payload exists company parameter
     * */
    if (!company) return res.status(400).json({
        'msg': "parameter company is missing"
    });
    /**
     * Check if the company has its column configuration
     * */
    if (!columns[company]) return res.status(400).json({
        'msg': "We don't have the configuration columns for this company"
    });
    /**
     * Parse CSV to a json object using csvtojson library
     * */
    csv({
            ignoreColumns: new RegExp(`^/(?!${Object.values(columns[company]).join('|')})([a-z0-9]+)/`)
        }, { objectMode: true })
            .fromString(req.files.file.data.toString())
            .then( (csvData) => {
                if (csvData.length === 0) return;

                const newRows = csvData.map((data) => ({
                    uuid: data[columns[company].UUID],
                    vin: data[columns[company].VIN],
                    make: data[columns[company].MAKE],
                    model: data[columns[company].MODEL],
                    mileage: data[columns[company].MILEAGE],
                    year: data[columns[company].YEAR],
                    price: data[columns[company].PRICE],
                    zipCode: data[columns[company].ZIP_CODE],
                    createDate: data[columns[company].CREATE_DATE],
                    updateDate: data[columns[company].UPDATE_DATE]
                }));
                /**
                 * Insert rows to DB
                 * */
                fileModel.insertMany(newRows).then(() => {
                    return res.status(200).json({
                        'msg': 'File uploaded successfully!', 'file': req.files.file.name
                    });
                }).catch(err => {
                    if (err) return res.status(400).json({
                        'msg': `Your file should have the following columns: ${Object.values(columns[company]).join(',')}`
                    });
                })
            });
};
