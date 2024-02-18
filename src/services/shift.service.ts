import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IShift } from '@src/models/Shift';
import { RouteError } from '@src/other/classes';
import shiftRepo from '@src/repos/shift.repo';
import { Op, WhereOptions } from 'sequelize';
import moment from 'moment';

// **** Variables **** //

// const SHIFT_NOT_FOUND_ERROR = 'Employee not found';
const SHIFT_REQUEST_ERROR = 'Request can not be handle';

class ShiftService {
  // **** Functions **** //

  /**
   * Get current shift.
   */
  public async getCurrentShift() {
    const now = moment();

    const params = {
      startTime: {
        [Op.lte]: now,
      },
      endTime: {
        [Op.gte]: now,
      },
    };

    try {
      const shifts = await shiftRepo.getShifts(params);
      const result = shifts.find((shift) => {
        return now.isBetween(shift.startTime, shift.endTime);
      });
      if (result) return result;
      else throw new Error();
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ addOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get all shift of a specific day
   */
  public async getByDay(date: Date) {
    const params: WhereOptions = {
      startTime: {
        [Op.gte]: moment(date).startOf('d'),
      },
      endTime: {
        [Op.lte]: moment(date).endOf('d'),
      },
    };
    const result = await shiftRepo.getShifts(params);
    return result;
  }

  /**
   * Create one shift.
   */
  public async createOne(shift: IShift) {
    try {
      const result = await shiftRepo.create(shift);
      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ addOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Update on shift
   */
  public updateOne() {}
}

export default new ShiftService();
