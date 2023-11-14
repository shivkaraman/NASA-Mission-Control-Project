const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('Should respond with status code 200 success', async () => {
        await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe('Test POST /launches', () => {
    const completeReqData = {
        mission: 'Kepler Exploration X',
        rocket: 'Explorer IS10',
        launchDate: 'October 21, 2028',
        target: 'Kepler-442 b',
    };
    const reqDataWithoutDate = {
        mission: 'Kepler Exploration X',
        rocket: 'Explorer IS10',
        target: 'Kepler-442 b',
    };

    test('Should respond with status code 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeReqData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeReqData.launchDate).valueOf();
        const responsetDate = new Date(response.body.launchDate).valueOf();

        expect(responsetDate).toBe(requestDate);
        expect(response.body).toMatchObject(reqDataWithoutDate);
    });

    test('Catch missing properties error', async () => {
        const response = await request(app)
            .post('/launches')
            .send(reqDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        });
    });

    test('Catch invalid launch date error', async () => {
        const response = await request(app)
            .post('/launches')
            .send({
                ...reqDataWithoutDate,
                launchDate: 'hello',
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        });
    });
});
