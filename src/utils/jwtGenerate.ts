/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'
export default function generateToken(body: any, sercet: string) {
    return jwt.sign(body, sercet, { algorithm: 'HS256' })
}
