import HttpStatusCodes from '../constants/HttpStatusCodes';
import { RouteError } from '../other/classes';
import { IReq, IRes } from '../routes/types/types';
import { EXPIRE_SESSION_ERROR, INVALID_TOKEN_ERROR } from '../services/auth.service';
import keyService from '../services/key.service';
import userService from '../services/user.service';
import { NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// **** Functions **** //

export const isAuthenticated = async (req: IReq, _: IRes, next?: NextFunction) => {
  const uid = req.signedCookies['uid'];
  const accessToken = req.signedCookies['token'];

  if (!uid || !accessToken) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'Need login first');
  }

  const foundKey = await keyService.getByUserId(uid);
  if (!foundKey) throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_TOKEN_ERROR);
  try {
    const publicKey = foundKey.publicKey;

    const tokenPayload = jwt.verify(accessToken, publicKey, {
      algorithms: ['HS256'],
    }) as JwtPayload;

    if (uid !== tokenPayload.id) throw new Error();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, EXPIRE_SESSION_ERROR);
    } else throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_TOKEN_ERROR);
  }
  if (next) next();
};

export const isAdmin = async (req: IReq, _: IRes, next?: NextFunction) => {
  const uid = req.signedCookies['uid'];
  const user = await userService.getById(uid);
  if (!user || user.role !== 'ADMIN') {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Not have permission');
  }
  if (next) next();
};
