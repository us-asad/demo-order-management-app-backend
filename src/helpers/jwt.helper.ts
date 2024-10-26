import pkg from 'jsonwebtoken'

import {Bcrypt} from './hashing.helper'

const {sign: jwtSign, verify: jwtVerify} = pkg as unknown as Bcrypt

export class JwtHelpers {
  public static sign(payload: any): string {
    return jwtSign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
  }

  public static verify(token: string): any | pkg.JwtPayload {
    return jwtVerify(token, process.env.JWT_SECRET) as unknown
  }
}
