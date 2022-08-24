const request = require('supertest');
const {Genre, validate} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;


describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index'); });
    afterEach(async () => {

        await Genre.remove({});
        await server.close();
    } );

    describe('GET /', () => {
        
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'},
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();

        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const res = await request(server).get('/api/genres/'+genre._id );

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
            // expect(res.body).toMatchObject(genre);
        });


        it('should return 404 if id is not valid', async () => {
            

            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();


            const res = await request(server).get('/api/genres/'+ id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token, name;
        const exec = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        };
        
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });


        it('should return 401 if the user is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if the genre passed by client is less than 5 characters', async () => {
  
            name = 'g1';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if the genre passed by client is more than 50 characters', async () => {
  
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });


        it('should save the genre in the database if it is valid', async () => {
            await exec();
            
            const genre = Genre.find({ name });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);


        });


    });

});
