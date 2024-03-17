import { Attendance as MAttendance } from './../models/Attendance';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import Attendance, { AttendanceModel } from '../models/Attendance';
import { RouteError } from '../other/classes';
import attendanceRepo from '../repos/attendance.repo';
import employeeRepo from '../repos/employee.repo';
import moment from 'moment';
import shiftService from './shift.service';
import { EmployeeShift } from '../models/EmployeeShift';
import employeeShiftRepo from '../repos/employee-shift.repo';

// **** Variables **** //

const ATTENDANCE_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

class AttendanceService {
  // **** Functions **** //

  /**
   * Take attendance.
   */
  public async takeAttendance(shiftId: string, faceId: string) {
    try {
      const employee = await employeeRepo.getByFaceId(faceId);
      const employeeShift = await employeeShiftRepo.getEmployeesOfShift(employee.id, shiftId);
      if (!employeeShift) throw new Error('Not be assign to this shift.');
      const attendance = await attendanceRepo.getByEmployeeAndShift(employee.id, shiftId);
      let message = 'You already take attendance';

      if (!attendance) {
        await this.createCheckIn(shiftId, employee.id);
        message = 'Check-in successfully';
      } else if (!attendance.checkOutTime) {
        await this.setCheckOut(attendance);
        message = 'Check-out successfully';
      }

      const result = { employee, message };

      return result;
    } catch (error) {
      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }

  /**
   * Create check-in record.
   */
  public async createCheckIn(shiftId: string, employeeId: string) {
    try {
      const now = moment().toDate();

      const attendance = Attendance.new(now, shiftId, employeeId);

      const result = await attendanceRepo.create(attendance);

      return result;
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ createCheckIn ~ error:', error);

      if (error instanceof RouteError) throw error;
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }

  /**
   * Set check-out.
   */
  public async setCheckOut(attendance: AttendanceModel) {
    try {
      const now = moment().toDate();

      attendance.setDataValue('checkOutTime', now);

      return await attendanceRepo.update(attendance);
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ setCheckOut ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }

  /**
   * getAttendanceRate
   */
  public async getAttendanceRate() {
    try {
      const now = moment().toDate();
      const dayShifts = await shiftService.getByWeek(now);
      let attendanceCount = 0;
      let expectAttendanceCount = 0;

      for (const shift of dayShifts) {
        attendanceCount += await MAttendance.count({ where: { shiftId: shift.id } });
        expectAttendanceCount += await EmployeeShift.count({ where: { shiftId: shift.id } });
      }

      const result = (attendanceCount / expectAttendanceCount) * 100;

      return result;
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ getAttendanceRate ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }

  /**
   * getByEmployeeId
   */
  public async getByEmployeeId(id: string, page: number, pageSize: number) {
    try {
      const records = await attendanceRepo.getByEmployeeId(id, page, pageSize);
      const total = await MAttendance.count({ where: { employeeId: id } });
      const totalPages = Math.ceil(total / pageSize);

      const result = { records, total, totalPages };
      return result;
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ getByEmployeeId ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }

  /**
   * getByEmployeeId
   */
  public async getByShiftId(id: string) {
    try {
      const result = await attendanceRepo.getByShiftId(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ getByEmployeeId ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }
}

export default new AttendanceService();
