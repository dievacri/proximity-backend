const request = require('supertest');
const app = require('../server');
const dbHandler = require('./utils/db-handler');
const {columns} = require('../constants/columns.js');
const { fileModel } = require('../models/File');

describe('Upload endpoint', () => {
    beforeAll(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    afterAll(async () => await dbHandler.closeDatabase());

    it('should run the server', async () => {
        const res = await request(app)
            .get('/');

        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("Welcome to the upload csv api");
    });

    it('should not upload file', async () => {
        const res = await request(app)
            .post('/upload-csv');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toBe("parameter file is missing");
    });

    it('should not upload file if it is not a .csv', async () => {
        const filePath = `${__dirname}/utils/test-file.txt`;
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toBe("parameter file has to be .csv");
    });

    it('should not upload file with missing company', async () => {
        const filePath = `${__dirname}/utils/test-csv.csv`;
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toBe("parameter company is missing");
    });

    it('should not upload file with wrong company', async () => {
        const filePath = `${__dirname}/utils/test-csv.csv`;
        const res = await request(app)
            .post('/upload-csv')
            .field('company', 'companyB')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toBe("We don't have the configuration columns for this company");
    });

    it('should not upload file with missing columns', async () => {
        const filePath = `${__dirname}/utils/test-csv-missing-column.csv`;
        const company = "companyA";

        const res = await request(app)
            .post('/upload-csv')
            .field('company', company)
            .attach('file', filePath);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toBe(`Your file should have the following columns: ${Object.values(columns[company]).join(',')}`);
    });

    it('should upload file', async () => {
        const filePath = `${__dirname}/utils/test-csv.csv`;
        const res = await request(app)
            .post('/upload-csv')
            .field('company', 'companyA')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('file');
        expect(res.body.file).toBe("test-csv.csv");
    });

    it('should upload file with extra columns', async () => {
        const filePath = `${__dirname}/utils/test-csv-extra-column.csv`;
        const res = await request(app)
            .post('/upload-csv')
            .field('company', 'companyA')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('file');
        expect(res.body.file).toBe("test-csv-extra-column.csv");
    });
});
