import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IShift } from '@src/models/Shift';
import { RouteError } from '@src/other/classes';
import shiftRepo from '@src/repos/shift.repo';
import { Op, WhereOptions } from 'sequelize';
import moment from 'moment';
import employeeShiftRepo from '@src/repos/employee-shift.repo';
import employeeService from './employee.service';

// **** Variables **** //

const SHIFT_NOT_FOUND_ERROR = 'Shift not found';
const SHIFT_REQUEST_ERROR = 'Request can not be handle';

class ShiftService {
  // **** Functions **** //

  /**
   * Get shift by Id
   */
  public async getById(id: string) {
    const result = await shiftRepo.getById(id);

    return result;
  }

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
   * Get all shift of a week by day
   */
  public async getByWeek(date: Date) {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const result = [];

    for (const day of weekDays) {
      const currentDay = moment(date).startOf('d').day(day).toDate();
      const dayShifts = await this.getByDay(currentDay);
      result.push(dayShifts);
    }

    return result;
  }

  /**
   * Get shift list.
   */
  public async getShiftEmployee(id: string) {
    const list = await employeeShiftRepo.getEmployeesOfShift(id);
    const result = [];

    for (const obj of list) {
      const employee = await employeeService.getOne(obj.employeeId);
      result.push(employee);
    }
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
   * Update one shift
   */
  public async updateOne(id: string, start?: Date, end?: Date) {
    const persists = await shiftRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, SHIFT_NOT_FOUND_ERROR);
    }
    try {
      const result = await shiftRepo.update(id, start, end);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ updateOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Delete one shift
   */
  public async deleteOne(id: string) {
    const persists = await shiftRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, SHIFT_NOT_FOUND_ERROR);
    }
    try {
      const result = await shiftRepo.delete(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ updateOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
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
      console.log('🚀 ~ ShiftService ~ assignEmployee ~ error:', error);

      throw error;
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
      console.log('🚀 ~ ShiftService ~ deAllocateEmployee ~ error:', error);

      throw error;
    }
  }
}

export default new ShiftService();
