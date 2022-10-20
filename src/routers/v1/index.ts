import { Router } from 'express'
import messageHandlerRouter from './messageHandler.router'

const routers = Router()
routers.use('/api/v1/', messageHandlerRouter)

export default routers
