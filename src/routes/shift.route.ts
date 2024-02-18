import Paths from '@src/constants/Paths';
import { IReq, IRes } from './types/types';
import { asyncHandler } from '@src/util/misc';
import { Router } from 'express';
import shiftService from '@src/services/shift.service';
import Shift, { IShift } from '@src/models/Shift';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';

// ** Add Router ** //

const shiftRouter = Router();

// **** Types **** //

interface ShiftRequest {
  start?: Date;
  end?: Date;
  day?: Date;
}

// **** Resolvers **** //

const shiftResolvers = {
  getByDay: async (req: IReq<ShiftRequest>, res: IRes) => {
    const { day } = req.body;
    if (!day) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please choose a day');
    }
    const result = await shiftService.getByDay(day);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },
  createOne: async (req: IReq<ShiftRequest>, res: IRes) => {
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
};

// **** Routes **** //

shiftRouter.route(Paths.Shift.CRUD).post(asyncHandler(shiftResolvers.createOne));

// **** Export default **** //

export default shiftRouter;
