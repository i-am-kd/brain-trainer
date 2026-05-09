import {describe, it, expect, beforeAll} from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe("game api", () =>{
    let token: string;
    let userId: string;

    //setup: register and login before running game tests 
    beforeAll(async ()=>{
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'game@example.com',
                username: 'gamer',
                password:'password123'
            });
        token = registerRes.body.token;
        userId = registerRes.body.user._id;
    });

    it('should get a word sequence', async ()=>{
        const res = await request(app)
            .get('/api/game/sequence')
            .set('Authorization', `Bearer ${token}`);


        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('words');
        expect(res.body).toHaveProperty('difficulty');
    });

    it("should submit a game result", async () =>{
        const seqRes = await request(app)
            .get('/api/game/sequence')
            .set('Authorization', `Bearer ${token}`);


        const sequenceId = seqRes.body.id;
        const res = await request(app)
            .post('/api/game/submit')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: userId, 
                sequenceId: sequenceId,
                userInput: ['apple', 'banana'],
                durationMs: 5000,
            });

            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('score');
        expect(res.body).toHaveProperty('feedback');
    });
});
