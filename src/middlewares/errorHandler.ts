import { Request, Response, NextFunction } from 'express'
import ResponseError from '../utils/responseError'
export default (
    err: ResponseError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(err.statusCode || 500).send({
        code: err.statusCode || 500,
        success: false,
        message: err.message || 'Internal Server Error'
    })
}
