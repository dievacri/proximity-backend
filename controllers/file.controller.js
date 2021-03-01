const csv = require('csvtojson');
const {fileModel} = require('../models/File');
const {columns} = require('../constants/columns.js');

exports.fileUpload = (req, res) => {
    if (req.files) {
        const { company } = req.body;
        if (columns[company]) {
            csv()
                .fromString(req.files.file.data.toString())
                .then((csvData) => {
                    const data = csvData.map((row) => ({
                        uuid: row[columns[company].UUID],
                        vin: row[columns[company].VIN],
                        make: row[columns[company].MAKE],
                        model: row[columns[company].MODEL],
                        mileage: row[columns[company].MILEAGE],
                        year: row[columns[company].YEAR],
                        price: row[columns[company].PRICE],
                        zipCode: row[columns[company].ZIP_CODE],
                        createDate: row[columns[company].CREATE_DATE],
                        updateDate: row[columns[company].UPDATE_DATE]
                    }));

                    fileModel.insertMany(data).then(() => {
                        res.status(200).json({
                            'msg': 'File uploaded successfully!', 'file': req.files.file.name
                        });
                    }).catch(reason => res.status(500).json(reason));
                })
        } else {
            res.status(400).json({
                'msg': "We don't have the configuration columns for this company"
            });
        }
    } else {
        res.status(400).json({
            'msg': "file is missing"
        });
    }
};
