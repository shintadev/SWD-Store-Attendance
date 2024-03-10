import Paths from '@src/constants/Paths';
import { asyncHandler } from '@src/util/misc';
import { Router } from 'express';
import { IReq, IRes } from './types/types';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import userService from '@src/services/user.service';
import User from '@src/models/User';
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
    const { id } = req.body;
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
  .get(asyncHandler(userResolvers.getById))
  .post(multer().none(), asyncHandler(userResolvers.create))
  .put(asyncHandler(userResolvers.update))
  .delete(asyncHandler(userResolvers.delete));

  userRouter
  .route(Paths.User.List)
  .get(multer().none(),asyncHandler(userResolvers.getList)); //Get list users

// **** Export default **** //

export default userRouter;
