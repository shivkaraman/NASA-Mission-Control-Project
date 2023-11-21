const request = require('supertest');
const app = require('../../app');
const { disconnectDB, connectToDB } = require('../../services/mongo');

describe('Test Planets API', () => {
    beforeAll(async () => {
        await connectToDB();
    });

    describe('GET /planets', () => {
        test('Should return 200 success', async () => {
            await request(app)
                .get('/planets')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    afterAll(async () => {
        await disconnectDB();
    });
});
