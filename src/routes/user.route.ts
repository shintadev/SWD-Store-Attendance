import Paths from '../constants/Paths';
import { asyncHandler } from '../util/misc';
import { Router } from 'express';
import { IReq, IRes } from './types/types';
import { RouteError } from '../other/classes';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import userService from '../services/user.service';
import User from '../models/User';
import multer from 'multer';

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
  getById: async (req: IReq<UserRequest>, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const user = await userService.getById(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: user,
    });
  },

  /**
   * Get list users.
   */
  getList: async (req: IReq<UserRequest>, res: IRes) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await userService.getList(page, pageSize);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  create: async (req: IReq<UserRequest>, res: IRes) => {
    const { id, password, role } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const user = User.new(id, password, role);

    const result = await userService.createOne(user);

    return res.status(HttpStatusCodes.CREATED).json({
      message: 'User created',
      data: result,
    });
  },

  update: async (req: IReq<UserRequest>, res: IRes) => {
    const { id, password, role } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await userService.updateOne(id, password, role);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result ?? 'Nothing to update.',
    });
  },

  delete: async (req: IReq<UserRequest>, res: IRes) => {
    const { id } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await userService.deleteOne(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },
};

// **** Routes **** //

userRouter
  .route(Paths.User.CRUD)
  .get(multer().none(), asyncHandler(userResolvers.getById))
  .post(multer().none(), asyncHandler(userResolvers.create))
  .put(multer().none(), asyncHandler(userResolvers.update))
  .delete(multer().none(), asyncHandler(userResolvers.delete));

userRouter.route(Paths.User.List).get(multer().none(), asyncHandler(userResolvers.getList));

// **** Export default **** //

export default userRouter;
