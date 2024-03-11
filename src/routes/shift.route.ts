import Paths from '@src/constants/Paths';
import { IReq, IRes } from './types/types';
import { asyncHandler } from '@src/util/misc';
import { Router } from 'express';
import shiftService from '@src/services/shift.service';
import Shift, { IShift } from '@src/models/Shift';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import moment from 'moment';
import multer from 'multer';

// ** Add Router ** //

const shiftRouter = Router();

// **** Types **** //

interface ShiftRequest {
  id?: string;
  start?: Date;
  end?: Date;
  day?: Date;
}

interface AssignRequest {
  employeeId: string;
  shiftId: string;
}

// **** Resolvers **** //

const shiftResolvers = {
  getById: async (req: IReq<ShiftRequest>, res: IRes) => {
    const id = String(req.query.id);
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const shift = await shiftService.getById(id);
    const employeeOfShift = await shiftService.getShiftEmployee(id);

    const result = { ...shift.dataValues, employeeOfShift };

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  getByWeek: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { day } = req.body;

    const result = await shiftService.getByWeek(day ?? moment().toDate()); // Default today

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  create: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { start, end } = req.body;
    if (!start || !end) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const shift: IShift = Shift.new(start, end);

    const result = await shiftService.createOne(shift);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  update: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { id, start, end } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await shiftService.updateOne(id, start, end);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  delete: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { id } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await shiftService.deleteOne(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  assign: async (req: IReq<AssignRequest>, res: IRes) => {
    const { employeeId, shiftId } = req.body;
    if (!employeeId || !shiftId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await shiftService.assignEmployee(employeeId, shiftId);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  deallocate: async (req: IReq<AssignRequest>, res: IRes) => {
    const { employeeId, shiftId } = req.body;
    if (!employeeId || !shiftId) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await shiftService.deAllocateEmployee(employeeId, shiftId);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },
};

// **** Routes **** //

shiftRouter
  .route(Paths.Shift.CRUD)
  .get(asyncHandler(shiftResolvers.getById))
  .post(asyncHandler(shiftResolvers.create))
  .put(asyncHandler(shiftResolvers.update))
  .delete(asyncHandler(shiftResolvers.delete));

shiftRouter
  .route(Paths.Shift.Schedule)
  .post(multer().none(), asyncHandler(shiftResolvers.getByWeek));

shiftRouter
  .route(Paths.Shift.Assign)
  .post(asyncHandler(shiftResolvers.assign))
  .put(asyncHandler(shiftResolvers.deallocate));

// **** Export default **** //

export default shiftRouter;
