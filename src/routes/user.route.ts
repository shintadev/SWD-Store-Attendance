import Paths from '@src/constants/Paths';
import { asyncHandler } from '@src/util/misc';
import { Router } from 'express';
import { IReq, IRes } from './types/types';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import userService from '@src/services/user.service';
import User from '@src/models/User';

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

  create: async (req: IReq<UserRequest>, res: IRes) => {
    const { id, password } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const user = User.new(id, password);

    const result = await userService.createOne(user);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
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
  .post(asyncHandler(userResolvers.create))
  .put(asyncHandler(userResolvers.update))
  .delete(asyncHandler(userResolvers.delete));

// **** Export default **** //

export default userRouter;
