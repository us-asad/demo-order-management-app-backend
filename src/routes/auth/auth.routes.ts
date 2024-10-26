import {Router} from 'express'

import {AuthController} from '../../controllers/auth'
import {auth} from '../../middlewares/auth.middleware'
import {validate} from '../../validators'
import {loginV} from '../../validators/auth/auth.validators'

export const router = Router()

/**
 * @api {get} /auth/me
 * @apiName Get User Info
 * @apiSuccess (200) {Object}
 */
router.get('/me', auth, AuthController.getMe)

/**
 * @api {post} /auth/login
 * @apiName Login
 * @apiSuccess (200) {Object}
 */
router.post('/login', loginV(), validate, AuthController.login)
