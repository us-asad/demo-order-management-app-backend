import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {NextFunction, Request, Response} from 'express'

import {JwtHelpers} from '../helpers/jwt.helper'
import {HttpException} from '../utils/exception/http.exception'

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, 'Unauthorized')
    }

    const decoded = JwtHelpers.verify(token)

    if (!decoded.user) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, 'Unauthorized')
    }

    if (decoded.user !== process.env.LOGIN_USERNAME) {
      throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'User not found!')
    }

    next()
  } catch (error: any) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error,
    })
  }
}
