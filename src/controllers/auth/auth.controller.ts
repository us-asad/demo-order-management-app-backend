import {ReasonPhrases, StatusCodes} from 'http-status-codes'

import {Request, Response} from 'express'

import {JwtHelpers} from '../../helpers/jwt.helper'
import {HttpException} from '../../utils/exception/http.exception'

export class AuthController {
  public static async getMe(req: Request, res: Response) {
    try {
      const {user} = req.body

      res.status(StatusCodes.CREATED).json({success: true, data: user})
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const {username, password} = req.body

      if (username !== process.env.LOGIN_USERNAME || password !== process.env.LOGIN_PASSWORD) {
        throw new HttpException(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, 'Wrong credentials!')
      }

      const token = JwtHelpers.sign({user: username})

      res.status(StatusCodes.CREATED).json({success: true, data: token})
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }
}
