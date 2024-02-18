import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Attendance from '@src/models/Attendance';
import { RouteError } from '@src/other/classes';
import attendanceRepo from '@src/repos/attendance.repo';
import employeeRepo from '@src/repos/employee.repo';
import moment from 'moment';

// **** Variables **** //

// const SHIFT_NOT_FOUND_ERROR = 'Record not found';
const ATTENDANCE_REQUEST_ERROR = 'Request can not be handle';

class AttendanceService {
  // **** Functions **** //

  /**
   * Create check-in record.
   */
  public async createCheckIn(shiftId: string, faceId: string) {
    try {
      const now = moment().toDate();

      const employee = await employeeRepo.getByFaceId(faceId);

      const attendance = Attendance.new(now, shiftId, employee.id);
      return await attendanceRepo.create(attendance);
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ createCheckIn ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }

  /**
   * Set check-out.
   */
  public async setCheckOut(shiftId: string, faceId: string) {
    try {
      const now = moment().toDate();

      const employee = await employeeRepo.getByFaceId(faceId);

      const attendance = await attendanceRepo.getByEmployeeAndShift(employee.id, shiftId);
      attendance.setDataValue('checkOutTime', now);

      return await attendanceRepo.update(attendance);
    } catch (error) {
      console.log('🚀 ~ AttendanceService ~ setCheckOut ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, ATTENDANCE_REQUEST_ERROR);
    }
  }
}

export default new AttendanceService();
