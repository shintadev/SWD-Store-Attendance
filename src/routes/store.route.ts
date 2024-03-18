import Paths from '../constants/Paths';
import { asyncHandler } from '../util/misc';
import { Router } from 'express';
import { IReq, IRes } from './types/types';
import { RouteError } from '../other/classes';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import storeService from '../services/store.service';
import Store from '../models/Store';
import multer from 'multer';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

// ** Add Router ** //

const storeRouter = Router();

// **** Types **** //

interface StoreRequest {
  id?: string;
  name?: string;
  managerId?: string;
}

// **** Resolvers **** //

const storeResolvers = {
  getById: async (req: IReq<StoreRequest>, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const store = await storeService.getById(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: store,
    });
  },

  /**
   * Get all stores.
   */
  getAll: async (_: IReq, res: IRes) => {
    const store = await storeService.getAll();

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: store,
    });
  },

  /**
   * Get list Stores.
   */
  getList: async (req: IReq<StoreRequest>, res: IRes) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await storeService.getList(page, pageSize);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  create: async (req: IReq<StoreRequest>, res: IRes) => {
    const { name, managerId } = req.body;
    if (!name || !managerId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const store = Store.new(name, managerId);

    const result = await storeService.createOne(store);

    return res.status(HttpStatusCodes.CREATED).json({
      message: 'Store created',
      data: result,
    });
  },

  update: async (req: IReq<StoreRequest>, res: IRes) => {
    const { id, name, managerId } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await storeService.updateOne(id, name, managerId);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result ?? 'Nothing to update.',
    });
  },

  delete: async (req: IReq<StoreRequest>, res: IRes) => {
    const { id } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await storeService.deleteOne(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },
};

// **** Routes **** //

storeRouter
  .route(Paths.Store.CRUD)
  .all(isAuthenticated)
  .get(multer().none(), asyncHandler(storeResolvers.getById))
  .post(multer().none(), isAdmin, asyncHandler(storeResolvers.create))
  .put(multer().none(), isAdmin, asyncHandler(storeResolvers.update))
  .delete(multer().none(), isAdmin, asyncHandler(storeResolvers.delete));

storeRouter.route(Paths.Store.All).get(multer().none(), asyncHandler(storeResolvers.getAll));

storeRouter
  .route(Paths.Store.List)
  .get(multer().none(), isAuthenticated, asyncHandler(storeResolvers.getList));

// **** Export default **** //

export default storeRouter;
