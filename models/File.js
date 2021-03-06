const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* Column Schema for companyA
* */
const fileSchema = new Schema({
    uuid: {
        type: String,
        required: true,
    },
    vin: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    mileage: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    createDate: {
        type: String,
        required: true,
    },
    updateDate: {
        type: String,
        required: true,
    }
});

exports.fileModel = mongoose.model("file", fileSchema);
