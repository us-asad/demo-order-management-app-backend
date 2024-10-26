import cors from 'cors'
import fs from 'fs'
import helmet from 'helmet'
import contentSecurityPolicy from 'helmet-csp'
import http from 'http'
import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import path from 'path'
import {Server, Socket} from 'socket.io'

import express, {Application, NextFunction, Request, Response} from 'express'

import {CONNECT_DB} from './config/database.config'
import {ConstantAPI} from './constants/api.constant'
import {Controller} from './controllers/controller.interface'
import {errorMiddleware} from './middlewares/error.middleware'
import {HttpException} from './utils/exception/http.exception'

const origin = ['http://localhost:5173']

export class App {
  public app: Application

  public constructor(controllers: Controller[]) {
    this.app = express()
    void CONNECT_DB()

    this.initializeConfig()
    this.initializeRoutes()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  private initializeConfig(): void {
    this.app.use(
      cors({
        origin,
      }),
    )
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(
      contentSecurityPolicy({
        useDefaults: true,
        directives: {
          defaultSrc: 'self',
          scriptSrc: 'self',
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
          contentSecurityPolicy: "font-src 'self' data:",
          frameAncestors: 'same-origin',
          connectSrc: 'self',
        },
        reportOnly: false,
      }),
    )
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
        xFrameOptions: {action: 'sameorigin'},
      }),
    )
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public', {recursive: true})
    }
    this.app.use(express.static(path.join(__dirname, '../public')))
  }

  private initializeRoutes(): void {
    this.app.get('/intro-video', (req: Request, res: Response) => {
      res.redirect('https://www.youtube.com/embed/1AyeCK6KVZI?si=he8mRWezQkxsVKI2')
    })

    this.app.get(ConstantAPI.ROOT, (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(StatusCodes.OK).json({
          status: {
            code: StatusCodes.OK,
            msg: StatusCodes.OK,
          },
          msg: ReasonPhrases.OK,
        })
      } catch (err: any) {
        console.warn(err)
        return next(
          new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, err.message),
        )
      }
    })
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use(ConstantAPI.API + controller.path, controller.router)
    })
    this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const err = {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        statusMsg: ReasonPhrases.NOT_FOUND,
        msg: 'Not Found',
      }
      next(err)
    })
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware)
  }
}
