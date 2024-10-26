import {ReasonPhrases, StatusCodes} from 'http-status-codes'
import {SortOrder} from 'mongoose'

import {Request, Response} from 'express'

import {OrderModel} from '../../models'
import {Order} from '../../types/order'
import {HttpException} from '../../utils/exception/http.exception'
import {generateRandomOrderID} from '../../utils/util-functions'

export class OrdersController {
  public static async getOrders(req: Request, res: Response) {
    try {
      const {page = 0, limit = 10, status, from, to, search, sort = 'desc'} = req.query as any

      const filters: any = {}

      if (status) {
        filters.status = status.toUpperCase()
      }

      if (from || to) {
        filters.orderedAt = {}
        if (from) filters.orderedAt.$gte = new Date(from)
        if (to) filters.orderedAt.$lte = new Date(to)
      }

      if (search) {
        filters.$or = [
          {'productDetails.name': {$regex: search, $options: 'i'}},
          {'customer.fullName': {$regex: search, $options: 'i'}},
          {orderID: parseInt(search) || null},
        ]
      }

      const sortOptions: {[key: string]: SortOrder} = {
        orderedAt: sort === 'asc' ? 1 : -1,
      }

      const orders = await OrderModel.find(filters)
        .sort(sortOptions)
        .skip(page * limit)
        .limit(parseInt(limit))
        .exec()

      const total = await OrderModel.countDocuments(filters)

      res.status(StatusCodes.OK).json({
        success: true,
        data: {total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit), orders},
      })
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }

  public static async getOrder(req: Request, res: Response) {
    try {
      const {orderID} = req.params
      const order = await OrderModel.findOne({orderID})

      if (!order) {
        throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Order not found!')
      }

      res.status(StatusCodes.OK).json({success: true, data: order})
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }

  public static async createOrder(req: Request, res: Response) {
    try {
      const order = await OrderModel.create({...req.body, orderID: generateRandomOrderID()})

      res.status(StatusCodes.OK).json({success: true, data: order.orderID})
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }

  public static async updateOrder(req: Request, res: Response) {
    try {
      const {orderID} = req.params
      const order = await OrderModel.findOne({orderID})

      if (!order) {
        throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Order not found!')
      }

      const updatingKeys: (keyof Order)[] = ['orderID', 'customer', 'status', 'note', 'productDetails', 'orderedAt']
      let updated = false

      for (const updatingKey of updatingKeys) {
        if (![undefined, null].includes(req.body[updatingKey])) {
          ;(order as Order)[updatingKey] =
            updatingKey === 'orderedAt' ? new Date(req.body[updatingKey]) : req.body[updatingKey]
          updated = true
        }
      }

      if (updated) {
        await order.save()
      }

      res.status(StatusCodes.OK).json({success: true})
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }

  public static async deleteOrder(req: Request, res: Response) {
    try {
      const {orderID} = req.params
      const order = await OrderModel.findOneAndDelete({orderID})

      if (!order) {
        throw new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, 'Order not found!')
      }

      res.status(StatusCodes.OK).json({success: true})
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      })
    }
  }
}
