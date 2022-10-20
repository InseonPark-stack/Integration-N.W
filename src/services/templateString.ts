/* eslint-disable curly */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/ban-types */

import axios from 'axios'
import environment from '../configs/environment'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function templateString(
    val: any,
    userId: string,
    token: string
) {
    try {
        const lineMessage = {
            content: {
                type: 'text',
                text: val,
            },
        }
        await axios.post(
            `https://www.worksapis.com/v1.0/bots/${environment.botId}/users/${userId}/messages`,
            lineMessage,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
    } catch (error: any) {
        console.log('error template string', error.message)
    }
}
