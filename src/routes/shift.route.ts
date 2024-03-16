import Paths from '../constants/Paths';
import { IReq, IRes } from './types/types';
import { asyncHandler } from '../util/misc';
import { Router } from 'express';
import shiftService from '../services/shift.service';
import Shift, { IShift } from '../models/Shift';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { RouteError } from '../other/classes';
import moment from 'moment';
import multer from 'multer';
import attendanceService from '@src/services/attendance.service';

// ** Add Router ** //

const shiftRouter = Router();

// **** Types **** //

interface ShiftRequest {
  id?: string;
  shiftNo?: number;
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
    const employeeOfShift = await shiftService.getEmployeeShiftByShiftId(id);
    const attendanceRecords = await attendanceService.getByShiftId(id);

    const result = { shift, employeeOfShift, attendanceRecords };

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
    const { shiftNo, day } = req.body;
    if (!shiftNo || !day) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const shift: IShift = Shift.new(shiftNo, moment(day).startOf('d').toDate());

    const result = await shiftService.createOne(shift);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  update: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { id, shiftNo, day } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }

    const result = await shiftService.updateOne(id, shiftNo, day);

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
  .get(multer().none(), asyncHandler(shiftResolvers.getById))
  .post(multer().none(), asyncHandler(shiftResolvers.create))
  .put(multer().none(), asyncHandler(shiftResolvers.update))
  .delete(multer().none(), asyncHandler(shiftResolvers.delete));

shiftRouter
  .route(Paths.Shift.Schedule)
  .post(multer().none(), asyncHandler(shiftResolvers.getByWeek));

shiftRouter
  .route(Paths.Shift.Assign)
  .post(multer().none(), asyncHandler(shiftResolvers.assign))
  .put(multer().none(), asyncHandler(shiftResolvers.deallocate));

// **** Export default **** //

export default shiftRouter;
