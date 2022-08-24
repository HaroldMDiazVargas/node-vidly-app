const request = require('supertest');
const {User} = require('../../../models/user');
const {Genre, validate} = require('../../../models/genre');
let server;

describe('auth middleware', () => {

    let token;

    const exec = async () => {    
        return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1'});
    };
    

    beforeEach(() => {
        server = require('../../../index'); 
        token = new User().generateAuthToken();
    });
    afterEach( async () => {
        
        await Genre.remove({}); 
        await server.close();
    } );



    it('should return 401 if not token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);

    });

    it('should return 400 if the client pass an invalid JWT', async () => {

        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if the client pass a valid JWT', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    });

});