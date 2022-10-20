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
export default async function templateList(
    template: any,
    userId: string,
    token: string
) {
    try {
        console.log('voday', template)
        const elements = template.payload.elements
        const bodyElement = elements.map((element: any) => {
            return {
                title: element.title,
                subtitle: element.subtitle,
                originalContentUrl: elements.image_url,
                action: {
                    type: 'message',
                    label: 'Talk',
                    postback: 'ListTemplate_Talk',
                },
            }
        })
        const body = {
            content: {
                type: 'list_template',
                coverData: {
                    backgroundImageUrl:
                        'https://thangtravel.vn/wp-content/uploads/2019/03/vietnam-travel-tips-FACEBOOK.jpg',
                },
                elements: bodyElement,
                actions: [
                    [
                        {
                            type: 'message',
                            label: 'View more',
                            postback: 'ListTempalte_ViewMore',
                        },
                    ],
                ],
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
        console.log('eror', error)
    }
}
