import 'dotenv/config'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routers from './routers/v1/index'
import errorHandler from './middlewares/errorHandler'

const app: Express = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(routers)
app.use(errorHandler)

export { app }
