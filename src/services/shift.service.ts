import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IShift } from '@src/models/Shift';
import { RouteError } from '@src/other/classes';
import shiftRepo from '@src/repos/shift.repo';
import { WhereOptions } from 'sequelize';
import moment from 'moment';
import employeeShiftRepo from '@src/repos/employee-shift.repo';
import employeeService from './employee.service';
import Shifts from '@src/constants/Shifts';

// **** Variables **** //

const SHIFT_NOT_FOUND_ERROR = 'Shift not found';
const SHIFT_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

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
    const currentHour = now.hours();
    const currentMinute = now.minutes();
    const currentTime = currentHour + ':' + currentMinute;

    const currentShift = Shifts.find((shift) => {
      return currentTime >= shift.startTime && currentTime < shift.endTime;
    });
    if (!currentShift) throw new Error('No shift currently');
    const params = {
      day: now.toDate(),
    };

    try {
      const shifts = await shiftRepo.getShifts(params);
      const result = shifts.find((shift) => {
        return shift.shiftNo === currentShift.no;
      });

      if (result) return result.dataValues;
      else throw new Error('No shift currently');
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ addOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Get all shift of a specific day
   */
  public async getByDay(date: Date) {
    const result = [];
    const params: WhereOptions = {
      day: moment(date).startOf('d').toDate(),
    };
    const shifts = await shiftRepo.getShifts(params);

    for (const shift of shifts) {
      result.push(shift.dataValues);
    }

    return result;
  }

  /**
   * getDayCount
   */
  public async getDayCount(date: Date) {
    const params: WhereOptions = {
      day: moment(date).startOf('d').toDate(),
    };
    const result = (await shiftRepo.getShifts(params)).length;

    return result;
  }

  /**
   * Get all shift of a week by day
   */
  public async getByWeek(date: Date) {
    const result: IShift[] = [];

    for (let n = 0; n <= 6; n++) {
      const currentDay = moment(date).weekday(n).toDate();
      const dayShifts = await this.getByDay(currentDay);
      dayShifts.forEach((dayShift) => {
        result.push(dayShift);
      });
    }

    return result;
  }

  /**
   * getWeekCount
   */
  public async getWeekCount(date: Date) {
    let result = 0;

    for (let n = 0; n <= 6; n++) {
      const currentDay = moment(date).weekday(n).toDate();
      const dayShifts = await this.getDayCount(currentDay);
      result += dayShifts;
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
      const params: WhereOptions = {
        shiftNo: shift.shiftNo,
        day: moment(shift.day).startOf('d').toDate(),
      };
      const shifts = await shiftRepo.getShifts(params);
      if (shifts.length != 0) throw new Error('Shift already created.');
      const result = await shiftRepo.create(shift);

      return result.dataValues;
    } catch (error) {
      console.log('🚀 ~ ShiftService ~ addOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, SHIFT_REQUEST_ERROR);
    }
  }

  /**
   * Update one shift
   */
  public async updateOne(id: string, shiftNo?: number, day?: Date) {
    const persists = await shiftRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, SHIFT_NOT_FOUND_ERROR);
    }
    try {
      const result = await shiftRepo.update(id, shiftNo, moment(day).startOf('d').toDate());

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
