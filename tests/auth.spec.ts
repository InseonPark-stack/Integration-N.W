import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/app'

describe('/token', () => {
    it('[POST] should return valid token', async () => {
        const secretKey = 'super_secret_key'
        /**
         * mock ENV
         */
        process.env = Object.assign(process.env, {
            CLIENT_SECRET: secretKey
        })
        const res = await request(app)
            .post('/api/v1/token')
            .send({ sub: 'sub', iss: 'clientId' })
        const isValidToken = await jwt.verify(res.body.jwt, secretKey)
        expect(isValidToken).toBeTruthy()
    })
})

