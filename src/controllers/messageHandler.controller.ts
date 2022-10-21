/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import queryString from 'node:querystring'
import environment from '../configs/environment'
import generateToken from '../utils/jwtGenerate'
import axios, { AxiosInstance } from 'axios'
import templateString from '../services/templateString'
import templateNaver from '../services/templateNaver'
dotenv.config()

declare let process: {
    env: {
        KORE_AI_BASE_URL: string
        CLIENT_ID: string
        SERVICE_ACCOUNT: string
        CLIENT_SECRET: string
        KORE_AI_CALLBACK_URL: string
        KORE_AI_CLIENT_ID: string
        KORE_AI_CLIENT_SECRET: string
    }
}
class CallBackLineWorks {
    private axiosAuth: AxiosInstance
    private axiosKore: AxiosInstance
    constructor() {
        this.axiosKore = axios.create({
            baseURL: process.env.KORE_AI_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        this.axiosAuth = axios.create({
            baseURL: 'https://auth.worksmobile.com/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
        })
    }
    getJwt = () => {
        try {
            const iat = Math.floor(Date.now() / 1000)
            return jwt.sign(
                {
                    iss: process.env.CLIENT_ID,
                    sub: process.env.SERVICE_ACCOUNT,
                    iat: iat,
                    exp: iat + 60 * 60,
                },
                environment.privateKey.replace(/\\n/g, '\n'),
                {
                    algorithm: 'RS256',
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    getLineWorksToken = async (jwtToken: string) => {
        try {
            const dataForm = queryString.stringify({
                assertion: jwtToken,
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                scope: 'board,board.read,bot,bot.read,calendar,calendar.read,contact.read,group.read,orgunit.read,user.email.read,user.read',
            })
            const headers = {
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                },
            }
            const token = await this.axiosAuth.post(
                'oauth2/v2.0/token',
                dataForm,
                headers
            )
            const accessToken = token.data.access_token
            console.log('accessToken', accessToken)
            return accessToken
        } catch (error) {
            console.log(error)
        }
    }
    callback = async (req: Request, res: Response) => {
        try {
            console.log('START')

            const message = req.body.content.text
            const userId = req.body.source.userId
            const token: any = this.getJwt()
            console.log('message', message)
            console.log('userId', userId)
            const tokenLineWorks = await this.getLineWorksToken(token)
            console.log('tokenLineWorks', tokenLineWorks)
            await this.sendMessage(tokenLineWorks, userId, message)
        } catch (error) {
            console.log(error)
        }
    }

    sendMessage = async (token: string, userId: string, message: string) => {
        try {
            console.log('userId', userId)
            console.log('token', token)
            console.log('message', message)
            const url = process.env.KORE_AI_CALLBACK_URL
            const koreMessage = {
                session: {
                    new: false,
                },
                message: {
                    type: 'text',
                    val: message,
                },
                from: {
                    id: userId,
                },
                mergeIdentity: true,
                preferredChannelForResponse: 'rtm',
            }
            const bodyKoreAi = {
                sub: userId,
                iss: process.env.KORE_AI_CLIENT_ID,
                algorithm: 'HS256',
            }

            const tokenKore = generateToken(
                bodyKoreAi,
                process.env.KORE_AI_CLIENT_SECRET
            )

            console.log('Data: ', url)
            console.log('Token kore: ', tokenKore)

            console.log('kore message ', JSON.stringify(koreMessage))

            const data = await this.axiosKore.post(url, koreMessage, {
                headers: {
                    Authorization: `Bearer ${tokenKore}`,
                },
            })
            const response = data.data.data
            console.log('data: ', data.data)
            let valueTemplate: any

            for (let i = 0; i < response.length; i++) {
                const data = response[i]
                const val = data.val
                console.log('val: ' + val)
                try {
                    const format = JSON.parse(val)
                    valueTemplate = format
                    console.log('formatted: ', valueTemplate)
                    await templateNaver(valueTemplate, userId, token)
                } catch (error) {
                    await templateString(val, userId, token)
                }
            }
        } catch (error: any) {
            console.log('Error happened when sending message: ', error)
        }
    }
}

export default new CallBackLineWorks()
