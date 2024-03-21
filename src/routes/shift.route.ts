import Paths from '../constants/Paths';
import { IReq, IRes } from './types/types';
import { asyncHandler } from '../util/misc';
import { Router } from 'express';
import shiftService from '../services/shift.service';
import Shift, { IShift } from '../models/Shift';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { RouteError } from '../other/classes';
import multer from 'multer';
import attendanceService from '../services/attendance.service';
import { isAuthenticated } from '@src/middlewares/auth.middleware';

// ** Add Router ** //

const shiftRouter = Router();

// **** Types **** //

interface ShiftRequest {
  id?: string;
  shiftNo?: number;
  day?: string;
  storeId?: string;
}

interface AssignRequest {
  employeeId: string;
  shiftId: string;
}

// **** Resolvers **** //

const shiftResolvers = {
  /**
   * Get shift by id.
   */
  getById: async (req: IReq, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const shift = await shiftService.getById(id);
      if (!shift) throw new Error('Shift not found.');
      const employeeOfShift = await shiftService.getEmployeeShiftByShiftId(id);
      const attendanceRecords = await attendanceService.getByShiftId(id);

      const result = { shift, employeeOfShift, attendanceRecords };

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
   * Get week schedule.
   */
  getByWeek: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { day, storeId } = req.body;
    if (!storeId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await shiftService.getByWeek(day ?? new Date().toISOString(), storeId);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ getByWeek: ~ error:', error);

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
   * Create new shift.
   */
  create: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { shiftNo, day, storeId } = req.body;
    if (!shiftNo || !day || !storeId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const shift: IShift = Shift.new(shiftNo, day ?? new Date().toISOString(), storeId);

      const result = await shiftService.createOne(shift);

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

  /**
   * Update shift.
   */
  update: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { id, shiftNo, day } = req.body;
    if (!id || !shiftNo || !day) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const shift: IShift = { id: id, shiftNo: shiftNo, day: day };

      const result = await shiftService.updateOne(shift);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Update successfully',
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

  /**
   * Delete shift.
   */
  delete: async (req: IReq, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await shiftService.deleteOne(id);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Deleted successfully',
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

  /**
   * Assign one employee to a shift.
   */
  assign: async (req: IReq<AssignRequest>, res: IRes) => {
    const { employeeId, shiftId } = req.body;
    if (!employeeId || !shiftId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await shiftService.assignEmployee(employeeId, shiftId);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ assign: ~ error:', error);

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
   * Un-assign one employee from a shift.
   */
  deallocate: async (req: IReq<AssignRequest>, res: IRes) => {
    const { employeeId, shiftId } = req.body;
    if (!employeeId || !shiftId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Missing params');
    }

    try {
      const result = await shiftService.deAllocateEmployee(employeeId, shiftId);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Request handled',
        data: result,
      });
    } catch (error) {
      console.log('🚀 ~ deallocate: ~ error:', error);

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

shiftRouter
  .route(Paths.Shift.CRUD)
  .all(isAuthenticated)
  .get(asyncHandler(shiftResolvers.getById))
  .post(multer().none(), asyncHandler(shiftResolvers.create))
  .put(multer().none(), asyncHandler(shiftResolvers.update))
  .delete(asyncHandler(shiftResolvers.delete));

shiftRouter
  .route(Paths.Shift.Schedule)
  .all(isAuthenticated)
  .post(multer().none(), asyncHandler(shiftResolvers.getByWeek));

shiftRouter
  .route(Paths.Shift.Assign)
  .all(isAuthenticated)
  .post(multer().none(), asyncHandler(shiftResolvers.assign))
  .put(multer().none(), asyncHandler(shiftResolvers.deallocate));

// **** Export default **** //

export default shiftRouter;
