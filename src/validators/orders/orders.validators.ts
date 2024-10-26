import {body, param} from 'express-validator'

import {OrderStatus} from '../../constants/statuses.constant'

export const getOrdersV = () => [
  param('page', '"page" is required to be number!').optional().isNumeric(),
  param('limit', '"limit" is required to be number!').optional().isNumeric(),
  param('status', '"status" is required to be a valid status!')
    .optional()
    .isIn(Object.values(OrderStatus).filter(status => typeof status === 'number')),
  param('from', '"from" is required to be a valid Date!').optional().isDate(),
  param('to', '"to" is required to be a valid Date!').optional().isNumeric(),
  param('search', '"search" is required to be string!').optional().isString(),
  param('sort', '"sort" is required to be asc or desc!').optional().isIn(['asc', 'desc']),
]

export const getOrderV = () => [param('orderID', '"orderID" is required!').isNumeric()]

export const createOrderV = () => [
  body('customer', '"customer" is required to be in a valid object format!').custom(customer =>
    Boolean(customer?.fullName && (customer?.phoneNumber ? typeof customer.phoneNumber === 'string' : true)),
  ),
  body('status', '"status" is required to be a valid status!').isIn(
    Object.values(OrderStatus).filter(status => typeof status === 'number'),
  ),
  body('note', '"note" is required to be string!').optional().isString(),
  body('productDetails', '"productDetails" is required to be in a valid object format!').custom(
    product => product?.name && product?.weight && product?.quantity && product?.price,
  ),
]

export const updateOrderV = () => [
  param('orderID', '"orderID" is required!').isNumeric(),
  body('customer', '"customer" is required to be in a valid object format!')
    .optional()
    .custom(customer =>
      Boolean(customer?.fullName && (customer?.phoneNumber ? typeof customer.phoneNumber === 'string' : true)),
    ),
  body('status', '"status" is required to be a valid status!')
    .optional()
    .isIn(Object.values(OrderStatus).filter(status => typeof status === 'number')),
  body('note', '"note" is required to be string!').optional().isString(),
  body('productDetails', '"productDetails" is required to be in a valid object format!')
    .optional()
    .custom(product => product?.name && product?.weight && product?.quantity && product?.price),
  body('orderedAt', '"orderedAt" is required to be string!').optional().isString(),
]

export const deleteOrderV = () => [param('orderID', '"orderID" is required!').isNumeric()]
