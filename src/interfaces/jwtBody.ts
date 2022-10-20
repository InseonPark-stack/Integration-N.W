export interface IBody {
    iss: string | null
}

export interface ILineTokenBody extends IBody {
    iat: number
    exp: number
    sub: string
}

export interface IKoreTokenBody extends IBody {
    sub: string | null
    algorithm: string
}
