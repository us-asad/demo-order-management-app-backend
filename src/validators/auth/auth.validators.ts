import {body} from 'express-validator'

export const loginV = () => [
  body('username', "'username' is required").isString(),
  body('password', "'password' is required").isString(),
]
