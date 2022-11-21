/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import queryString from 'queryString'
import environment from '../configs/environment'
import generateToken from '../utils/jwtGenerate'
import axios, { AxiosInstance } from 'axios'
import templateString from '../services/templateString'
import templateNaver from '../services/templateNaver'
import templateButton from '../services/templateButton'
import templateCarousel from '../services/templateCarousel'
import templateCarouselImages from '../services/templateCarouselImage'
import templateList from '../services/templateList'
import { arrayBuffer } from 'stream/consumers'
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
            console.log('response : ' + response)
            console.log('data: ', data.data)


            const solve = async(data: any) => {
                for(let i = 0; i < data.length; i++){
                    let val = data[i].val
                    try {                    
                        if(typeof(val) === 'string' && val.includes('flex') && val.includes('language')){
                            const format = JSON.parse(val)
                            val = format
                        }else{
                            const format = JSON.stringify(val)
                            console.log('JSON 확인 차 : ' + format)
                        }
                        if (val.content && val.content.type === 'flex'){
                            await templateNaver(val, userId, token)
                        }
                        else {
                            await templateString(val, userId, token)
                        }                    
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            solve(response)

            // const delay = async(data: any) => {
            //     return new Promise(async () => {
            //         let val = data.val
            //         try {                    
            //             if(typeof(val) === 'string' && val.includes('flex') && val.includes('language')){
            //                 const format = JSON.parse(val)
            //                 val = format
            //             }else{
            //                 const format = JSON.stringify(val)
            //                 console.log('JSON 확인 차 : ' + format)
            //             }
    
            //             if (val.content && val.content.type === 'flex'){
            //                 await templateNaver(val, userId, token)
            //             }
            //             else {
            //                 await templateString(data.val, userId, token)
            //             }
            //             setTimeout(() => {

            //             },2000)                        
            //         } catch (error) {
            //             console.log(error)
            //         }
            //     })
            //   }

            // const callAPI = async (list: any) => {
            //     console.log("Start")
            //     const promises = list.map(async (data : any) => {
            //         return await delay(data)
            //         .then(() => data)
            //     })
                
            //     const results = await Promise.all(promises)
            //     results.forEach(data => console.log(data))
            // }

            // callAPI(response);

            // response.forEach(async(data: any, index: Number) => {
            //     let val = data.val
            //     try {                    
            //         if(typeof(val) === 'string' && val.includes('flex') && val.includes('language')){
            //             const format = JSON.parse(val)
            //             val = format
            //         }else{
            //             const format = JSON.stringify(val)
            //             console.log('JSON 확인 차 : ' + format)
            //         }
            //         console.log('val: ' + val)
            //         if (val.payload && val.payload.template_type === 'button') {
            //             templateButton(val, userId, token)
            //         }

            //         else if (val.type === 'list_template') {
            //             templateList(val, userId, token)
            //         }
        
            //         else if (val.type === 'carousel_template') {
            //              templateCarousel(val, userId, token)
            //         }
        
            //         else if (val.type === 'carousel_image_template') {
            //              templateCarouselImages(val, userId, token)
            //         }

            //         if (val.content && val.content.type === 'flex'){
            //             await templateNaver(val, userId, token)
            //         }
            //         else {
            //             await templateString(data.val, userId, token)
            //         }
                    
            //     } catch (error) {
            //         console.log(error)
            //     }
            // })



            // for (let i = 0; i < response.length; i++) {
            //     const data = response[i]
            //     const val = data.val
            //     console.log('val: ' + val)
            //     if(data.type == "template"){
            //         const format = JSON.stringify(data.val)
            //         console.log('format : ' + format)
            //     }                
            //     try {
            //         const format = JSON.parse(val)
            //         val = format
            //         console.log('formatted: ', val)
                    
            //     } catch (error) {
            //         await templateString(val, userId, token)
            //     }
            // }
        } catch (error: any) {
            console.log('Error happened when sending message: ', error)
        }
    }
}

export default new CallBackLineWorks()
