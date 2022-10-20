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
export default async function templateCarousel(
    template: any,
    userId: string,
    token: string
) {
    try {
        const elements = template.payload.elements
        const bodyElement = elements.map((element: any) => {
            return {
                originalContentUrl: element.image_url,
                title: element.title,
                text: element.subtitle,
                defaultAction: {
                    type: 'uri',
                    uri: 'https://line.worksmobile.com',
                },
                actions: [
                    {
                        type: 'uri',
                        label: 'Visit',
                        uri: 'https://line.worksmobile.com',
                    },
                ],
            }
        })
        const body = {
            content: {
                type: 'carousel',
                columns: bodyElement,
            },
        }
        await axios.post(
            `https://www.worksapis.com/v1.0/bots/${environment.botId}/users/${userId}/messages`,
            body,
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
