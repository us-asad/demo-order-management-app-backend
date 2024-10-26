import {ConstantAPI} from '../constants/api.constant'
import {Controller} from '../controllers/controller.interface'
import {router as AuthRouter} from './auth'
import {router as OrdersRouter} from './orders'

export const Routes: Controller[] = [
  {
    path: ConstantAPI.AUTH,
    router: AuthRouter,
  },
  {
    path: ConstantAPI.ORDERS,
    router: OrdersRouter,
  },
]
