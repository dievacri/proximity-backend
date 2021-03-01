const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

describe('Upload endpoint', () => {
    let testFilePath = null;
    beforeEach((done) => {
        const dbUrl = "mongodb://localhost:27017/file";
        mongoose.connect(dbUrl,
            {useNewUrlParser: true, useUnifiedTopology: true},
            () => done());
    });

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
        expect(res.body.msg).toBe("file is missing");
    });

    it('should not upload file with missing company', async () => {
        const filePath = `${__dirname}/test-csv.csv`;
        console.log(filePath);
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg');
        expect(res.body.msg).toBe("We don't have the configuration columns for this company");
    });

    it('should upload file', async () => {
        const filePath = `${__dirname}/test-csv.csv`;
        const res = await request(app)
            .post('/upload-csv')
            .field('company', 'companyA')
            .attach('file', filePath);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('file');
        expect(res.body.file).toBe("test-csv.csv");
    });

    afterEach((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done())
        });
    });
});
