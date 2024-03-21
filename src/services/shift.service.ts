import HttpStatusCodes from '../constants/HttpStatusCodes';
import { IShift } from '../models/Shift';
import { RouteError } from '../other/classes';
import shiftRepo from '../repos/shift.repo';
import { WhereOptions } from 'sequelize';
import moment from 'moment';
import employeeShiftRepo from '../repos/employee-shift.repo';
import Shifts from '../constants/Shifts';

// **** Variables **** //

const SHIFT_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

class ShiftService {
  // **** Functions **** //

  /**
   * Get shift by Id
   */
  public async getById(id: string) {
    try {
      const result = await shiftRepo.getById(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ getById ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get current shift.
   */
  public async getCurrentShift(storeId: string) {
    const now = new Date();
    let currentHour = now.getUTCHours() + 7;
    if (currentHour >= 24) currentHour -= 24;
    const currentMinute = now.getUTCMinutes();
    const currentTime = currentHour + ':' + currentMinute;

    const currentShift = Shifts.find((shift) => {
      return currentTime >= shift.startTime && currentTime < shift.endTime;
    });
    if (!currentShift) throw new Error('No shift currently');

    try {
      const params = {
        day: now.toISOString(),
        storeId: storeId,
      };

      const shifts = await shiftRepo.getShifts(params); //Get all shift today of a store

      const result = shifts.find((shift) => {
        return shift.shiftNo === currentShift.no; //Get the one happen now
      });

      if (result) return result;
      else throw new Error('No shift currently');
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ getCurrentShift ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get all shift of a specific day
   */
  public async getByDay(date: Date, storeId?: string) {
    try {
      const params: WhereOptions = {
        day: date.toISOString(),
      };
      if (storeId) params.storeId = storeId;
      const result = await shiftRepo.getShifts(params);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ getByDay ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get all shift of a week by day
   */
  public async getByWeek(date: string, storeId?: string) {
    const result: IShift[] = [];
    try {
      for (let n = 0; n <= 6; n++) {
        const currentDay = moment(date).weekday(n).toDate();
        const dayShifts = await this.getByDay(currentDay, storeId);
        dayShifts.forEach((dayShift) => {
          result.push(dayShift);
        });
      }

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ getByWeek ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Create one shift.
   */
  public async createOne(shift: IShift) {
    try {
      const params: WhereOptions = {
        shiftNo: shift.shiftNo,
        day: new Date(shift.day).toISOString(),
        storeId: shift.storeId,
      };
      const shifts = await shiftRepo.getShifts(params);
      if (shifts.length != 0) throw new Error('Shift already created.');

      const result = await shiftRepo.create(shift);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ createOne ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Update one shift
   */
  public async updateOne(shift: IShift) {
    try {
      const result = await shiftRepo.update(shift);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ updateOne ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Delete one shift
   */
  public async deleteOne(id: string) {
    try {
      const result = await shiftRepo.delete(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ deleteOne ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get employee shift list.
   */
  public async getEmployeesOfShift(employeeId: string, shiftId: string) {
    try {
      const result = await employeeShiftRepo.getEmployeesOfShift(employeeId, shiftId);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ getEmployeesOfShift ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get employee shift by shiftId
   */
  public async getEmployeeShiftByShiftId(shiftId: string) {
    try {
      const result = await employeeShiftRepo.getEmployeeShiftByShiftId(shiftId);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ getEmployeeShiftByShiftId ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Assign one employee to shift.
   */
  public async assignEmployee(employeeId: string, shiftId: string) {
    try {
      const employeeShift = {
        employeeId: employeeId,
        shiftId: shiftId,
      };
      const result = await employeeShiftRepo.create(employeeShift);

      return result;
    } catch (error) {
      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * De-allocate one employee from shift.
   */
  public async deAllocateEmployee(employeeId: string, shiftId: string) {
    try {
      const employeeShift = {
        employeeId: employeeId,
        shiftId: shiftId,
      };
      const result = await employeeShiftRepo.delete(employeeShift);

      return result;
    } catch (error) {
      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }
}

export default new ShiftService();
