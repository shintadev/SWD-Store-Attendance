import Paths from '../constants/Paths';
import { asyncHandler } from '../util/misc';
import { Router } from 'express';
import { IReq, IRes } from './types/types';
import { RouteError } from '../other/classes';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import userService from '../services/user.service';
import User from '../models/User';
import multer from 'multer';
import { isAdmin, isAuthenticated } from '@src/middlewares/auth.middleware';

// ** Add Router ** //

const userRouter = Router();

// **** Types **** //

interface UserRequest {
  id?: string;
  password?: string;
  role?: string;
}

// **** Resolvers **** //

const userResolvers = {
  getById: async (req: IReq, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const user = await userService.getById(id);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: user,
      });
    } catch (error) {
      console.log('🚀 ~ getById: ~ error:', error);

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

  /**
   * Get list users.
   */
  getList: async (req: IReq, res: IRes) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    try {
      const result = await userService.getList(page, pageSize);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ getList: ~ error:', error);

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

  create: async (req: IReq<UserRequest>, res: IRes) => {
    const { id, password, role } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const user = User.new(id, password, role);

      const result = await userService.createOne(user);

      return res.status(HttpStatusCodes.CREATED).json({
        message: 'Create successfully',
        data: result,
      });
    } catch (error) {
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

  update: async (req: IReq<UserRequest>, res: IRes) => {
    const { id, password, role } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }
    try {
      const result = await userService.updateOne(id, password, role);

      return res.status(HttpStatusCodes.OK).json({
        message: result ? 'Update successfully' : 'Nothing to update.',
        data: result,
      });
    } catch (error) {
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

  delete: async (req: IReq, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await userService.deleteOne(id);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Delete successfully',
        data: result,
      });
    } catch (error) {
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

userRouter
  .route(Paths.User.CRUD)
  .all(isAuthenticated, isAdmin)
  .get(asyncHandler(userResolvers.getById))
  .post(multer().none(), asyncHandler(userResolvers.create))
  .put(multer().none(), asyncHandler(userResolvers.update))
  .delete(asyncHandler(userResolvers.delete));

userRouter
  .route(Paths.User.List)
  .all(isAuthenticated, isAdmin)
  .get(asyncHandler(userResolvers.getList));

// **** Export default **** //

export default userRouter;
