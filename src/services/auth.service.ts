import { createJWTTokenPair, generateAccessToken, generateKeyPair } from '../libs/token';
import keyService from './key.service';
import Key from '../models/Key';
import { verify } from '../util/auth.util';
import { RouteError } from '../other/classes';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import userService from './user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

// **** Variables **** //

const AUTH_REQUEST_ERROR = 'Authenticate failed.';
export const INVALID_TOKEN_ERROR = 'Invalid token.';
export const EXPIRE_SESSION_ERROR = 'Expired session. You must re-login.';

// **** Class **** //

class AuthService {
  // **** Functions **** //

  /**
   * Login
   */
  public async login(id: string, password: string) {
    try {
      const user = await verify(id, password);
      let keyObject = (await keyService.getByUserId(user.id))?.dataValues;
      if (!keyObject) {
        const { publicKey, privateKey } = generateKeyPair();
        const { accessToken, refreshToken } = createJWTTokenPair(
          {
            id: user.id,
            role: user.role,
          },
          publicKey,
          privateKey
        );

        keyObject = Key.new(user.id, publicKey, privateKey, accessToken, refreshToken);
        await keyService.createKeyToken(keyObject);
      } else {
        const { accessToken, refreshToken } = createJWTTokenPair(
          {
            id: user.id,
            role: user.role,
          },
          keyObject.publicKey,
          keyObject.privateKey
        );
        keyObject.accessToken = accessToken;
        keyObject.refreshToken = refreshToken;

        await keyService.updateKeyToken(keyObject);
      }

      return {
        uid: user.id,
        role: user.role,
        accessToken: keyObject.accessToken,
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ login ~ error:', error);

      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, AUTH_REQUEST_ERROR);
    }
  }

  /**
   * Refresh tokens
   */
  public async refreshToken(uid: string, accessToken: string) {
    try {
      const user = await userService.getById(uid);
      const foundKey = await keyService.getByUserId(uid);

      if (!foundKey) throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_TOKEN_ERROR);

      const publicKey = foundKey.publicKey;
      const privateKey = foundKey.privateKey;
      const refreshToken = foundKey.refreshToken;

      try {
        const tokenPayload = jwt.verify(accessToken, publicKey, {
          ignoreExpiration: true,
          algorithms: ['HS256'],
        }) as JwtPayload;
        if (uid !== tokenPayload.id) throw new Error();
      } catch (error) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_TOKEN_ERROR);
      }

      try {
        const tokenPayload = jwt.verify(refreshToken, privateKey, {
          algorithms: ['HS256'],
        }) as JwtPayload;
        if (uid !== tokenPayload.id) throw new Error();
      } catch (error) {
        if (error instanceof Error && error.name === 'TokenExpiredError')
          throw new RouteError(HttpStatusCodes.UNAUTHORIZED, EXPIRE_SESSION_ERROR);
        else throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_TOKEN_ERROR);
      }
      const result = generateAccessToken(
        {
          id: user.id,
          role: user.role,
        },
        publicKey
      );
      return result;
    } catch (error) {
      console.log('🚀 ~ AuthService ~ refreshToken ~ error:', error);

      if (error instanceof RouteError) throw error;
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, AUTH_REQUEST_ERROR);
    }
  }
}

// **** Export default **** //

export default new AuthService();
