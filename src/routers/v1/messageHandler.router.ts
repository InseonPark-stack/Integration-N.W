import { Router } from 'express'
import CallBackLineWorks from '../../controllers/messageHandler.controller'
const router = Router()

router
    .route('/callback')
    .post(CallBackLineWorks.callback.bind(CallBackLineWorks))
export default router
