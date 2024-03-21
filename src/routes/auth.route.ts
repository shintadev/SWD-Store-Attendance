import { Router } from 'express';
import { IReq, IRes } from './types/types';
import { RouteError } from '../other/classes';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import authService from '../services/auth.service';
import EnvVars from '../constants/EnvVars';
import Paths from '../constants/Paths';
import { asyncHandler } from '../util/misc';
import { isAuthenticated } from '../middlewares/auth.middleware';
import multer from 'multer';

// ** Add Router ** //

const authRouter = Router();

// **** Types **** //

export interface AuthRequest {
  id?: string;
  password?: string;
}

// **** Resolvers **** //

const authResolvers = {
  login: async (req: IReq<AuthRequest>, res: IRes) => {
    const { id, password } = req.body;
    if (!id || !password) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await authService.login(id, password);

      res.clearCookie('uid');
      res.clearCookie('role');
      res.clearCookie('token');

      res.cookie('uid', result.uid, EnvVars.CookieProps.Options);
      // res.cookie('role', result.role, { ...EnvVars.CookieProps.Options, signed: false });
      res.cookie('token', result.accessToken, EnvVars.CookieProps.Options);

      res.status(HttpStatusCodes.OK).json({
        message: 'Login successfully.',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ login: ~ error:', error);

      if (error instanceof Error) {
        let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        if (error instanceof RouteError) {
          status = error.status;
        }
        throw new RouteError(status, error.message);
      }
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'UNDEFINED_ERROR');
    }
  },

  logout: (_: IReq<AuthRequest>, res: IRes) => {
    try {
      res.clearCookie('uid');
      res.clearCookie('role');
      res.clearCookie('token');
      res.status(HttpStatusCodes.OK).json({
        message: 'Logout successfully.',
      });
    } catch (error) {
      console.log('🚀 ~ error:', error);

      if (error instanceof Error) {
        let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        if (error instanceof RouteError) {
          status = error.status;
        }
        throw new RouteError(status, error.message);
      }
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'UNDEFINED_ERROR');
    }
  },

  refreshToken: async (req: IReq, res: IRes) => {
    const uid = req.signedCookies['uid'];
    const oldToken = req.signedCookies['token'];
    if (!uid || !oldToken) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }
    try {
      const newToken = await authService.refreshToken(uid, oldToken);

      res.clearCookie('token');
      res.cookie('token', newToken, EnvVars.CookieProps.Options);
      res.status(HttpStatusCodes.OK).json({
        message: 'Refresh token successfully',
      });
    } catch (error) {
      console.log('🚀 ~ refreshToken: ~ error:', error);

      if (error instanceof Error) {
        let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        if (error instanceof RouteError) {
          status = error.status;
        }
        throw new RouteError(status, error.message);
      }
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'UNDEFINED_ERROR');
    }
  },
};

// **** Routes **** //

authRouter.route(Paths.Auth.Login).post(multer().none(), asyncHandler(authResolvers.login));
authRouter.route(Paths.Auth.Logout).post(asyncHandler(authResolvers.logout));
authRouter
  .route(Paths.Auth.RefreshToken)
  .post(isAuthenticated, asyncHandler(authResolvers.refreshToken));

// **** Export default **** //

export default authRouter;
