const request = require('supertest');
const app = require('../../app');

describe('GET /planets', () => {
    test('Should return 200 success', async () => {
        await request(app)
            .get('/planets')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});
