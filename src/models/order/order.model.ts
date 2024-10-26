import {Schema, model} from 'mongoose'

import {CollectionNames} from '../../constants/db.constants'
import {OrderStatus} from '../../constants/statuses.constant'

const ModelSchema = new Schema(
  {
    orderID: {
      type: Number,
      required: true,
    },
    customer: {
      fullName: {
        type: String,
        required: true,
      },
      phoneNumber: String,
    },
    status: {
      type: Number,
      default: OrderStatus.AWAITING_PAYMENT,
    },
    note: String,
    productDetails: {
      name: {
        type: String,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {versionKey: false, timestamps: true},
)

export const OrderModel = model(CollectionNames.ORDER, ModelSchema, CollectionNames.ORDER)
