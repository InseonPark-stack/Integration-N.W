import dotenv from 'dotenv'

dotenv.config()

const environment = {
    privateKey: process.env.PRIVATE_KEY || '',
    botId: process.env.BOT_ID || '',
}

export default environment
