import {Router} from 'express'

import {OrdersController} from '../../controllers/orders'
import {auth} from '../../middlewares/auth.middleware'
import {validate} from '../../validators'
import {createOrderV, deleteOrderV, getOrderV, getOrdersV, updateOrderV} from '../../validators/orders'

export const router = Router()

/**
 * @api {get} /orders/
 * @apiName Get Orders
 * @apiSuccess (200) {Object}
 */
router.get('/', auth, getOrdersV(), validate, OrdersController.getOrders)

/**
 * @api {post} /orders/
 * @apiName Create Order
 * @apiSuccess (200) {Object}
 */
router.post('/', auth, createOrderV(), validate, OrdersController.createOrder)

/**
 * @api {get} /orders/:orderID
 * @apiName Get Order
 * @apiSuccess (200) {Object}
 */
router.get('/:orderID', auth, getOrderV(), validate, OrdersController.getOrder)

/**
 * @api {put} /orders/:orderID
 * @apiName Update Order
 * @apiSuccess (200) {Object}
 */
router.put('/:orderID', auth, updateOrderV(), validate, OrdersController.updateOrder)

/**
 * @api {delete} /orders/:orderID
 * @apiName Delete Order
 * @apiSuccess (200) {Object}
 */
router.delete('/:orderID', auth, deleteOrderV(), validate, OrdersController.deleteOrder)
