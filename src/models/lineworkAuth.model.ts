import BaseModel from './base.model'

export default interface LineworkAuthModel extends BaseModel {
    access_token: string
    refresh_token: string
    expires_at: number
}
