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
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const result = await authService.login(id, password);

    res.clearCookie('uid');
    res.clearCookie('token');

    res.cookie('uid', result.uid, EnvVars.CookieProps.Options);
    res.cookie('token', result.accessToken, EnvVars.CookieProps.Options);

    res.status(HttpStatusCodes.OK).json({
      message: 'Login successfully',
      data: result,
    });
    res.end();
  },

  logout: (_: IReq<AuthRequest>, res: IRes) => {
    res.clearCookie('uid');
    res.clearCookie('token');
    res.status(HttpStatusCodes.OK).json({
      message: 'Logout successful',
    });
    // res.end();
  },

  refreshToken: async (req: IReq<AuthRequest>, res: IRes) => {
    const uid = req.signedCookies['uid'];
    const oldToken = req.signedCookies['token'];
    const newToken = await authService.refreshToken(uid, oldToken);

    res.clearCookie('token');
    res.cookie('token', newToken, EnvVars.CookieProps.Options);
    res.status(HttpStatusCodes.OK).json({
      message: 'Refresh token successfully',
    });
    res.end();
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
