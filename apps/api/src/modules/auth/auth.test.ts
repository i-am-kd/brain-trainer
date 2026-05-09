import { describe, it, expect } from "vitest";
import request from "supertest";
import app from '../../app.js';
import { User } from "../../db/models/User.ts";

describe('Auth API', () =>{
    it('should register a new user', async () =>{
        const res = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'test@example.com',
            username: 'tester',
            password: 'password123',
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.username).toBe('tester');
    });

    it('should login with valid credentials', async() =>{
        const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'login@example.com',
            username: 'logintester',
            password: 'password1234',
        });

        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'login@example.com',
            password: 'password1234',
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token')
    });

    it('should fail login with wrong password', async ()=>{
        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email:'login@example.com',
            password: 'password',
        });
        expect(res.statusCode).toEqual(401);
    });
});


