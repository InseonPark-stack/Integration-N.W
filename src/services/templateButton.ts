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
export default async function templateButton(
    template: any,
    userId: string,
    token: string
) {
    try {
        const responseTemplate: any = template ? template!.payload.buttons : []
        const requestTemplateLineWork: any[] = []
        responseTemplate.forEach((data: any, index: Number) => {
            if (data.title.length > 20) {                
                data.title = data.title.substring(0, 20)
            }
            if(data.type === 'url'){
                data.type = 'uri'
                data.label = data.title
                data.uri = data.url + '&channel=rtm'
            }else {
                data.type = 'message'
                data.label = data.title
                data.text = data.title
            }
            delete data.payload,
            delete data.title
            requestTemplateLineWork.push(data)
        })
        const bodyRequestThemplateLineWork: any = {
            content: {
                type: 'button_template',
                contentText: template
                    ? template!.payload.text
                    : 'what do you want?',
                actions: requestTemplateLineWork,
            },
        }
        const res = await axios.post(
            `https://www.worksapis.com/v1.0/bots/${environment.botId}/users/${userId}/messages`,
            bodyRequestThemplateLineWork,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
    } catch (error) {
        console.log(error)
    }
}
