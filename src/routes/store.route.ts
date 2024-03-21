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
  getById: async (req: IReq, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await storeService.getById(id);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: result,
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
   * Get all stores.
   */
  getAll: async (_: IReq, res: IRes) => {
    try {
      const result = await storeService.getAll();

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ getAll: ~ error:', error);

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
   * Get list Stores.
   */
  getList: async (req: IReq, res: IRes) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    try {
      const result = await storeService.getList(page, pageSize);

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

  create: async (req: IReq<StoreRequest>, res: IRes) => {
    const { name, managerId } = req.body;
    if (!name || !managerId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const store = Store.new(name, managerId);

      const result = await storeService.createOne(store);

      return res.status(HttpStatusCodes.CREATED).json({
        message: 'Create successfully',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ create: ~ error:', error);

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

  update: async (req: IReq<StoreRequest>, res: IRes) => {
    const { id, name, managerId } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await storeService.updateOne(id, name, managerId);

      return res.status(HttpStatusCodes.OK).json({
        message: result ? 'Update successfully' : 'Nothing to update.',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ update: ~ error:', error);

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
      const result = await storeService.deleteOne(id);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Delete successfully',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ delete: ~ error:', error);

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

storeRouter
  .route(Paths.Store.CRUD)
  .all(isAuthenticated)
  .get(asyncHandler(storeResolvers.getById))
  .post(multer().none(), isAdmin, asyncHandler(storeResolvers.create))
  .put(multer().none(), isAdmin, asyncHandler(storeResolvers.update))
  .delete(isAdmin, asyncHandler(storeResolvers.delete));

storeRouter.route(Paths.Store.All).get(asyncHandler(storeResolvers.getAll));

storeRouter.route(Paths.Store.List).get(isAuthenticated, asyncHandler(storeResolvers.getList));

// **** Export default **** //

export default storeRouter;
