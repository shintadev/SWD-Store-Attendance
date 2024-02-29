import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Attendance, { AttendanceModel } from '@src/models/Attendance';
import { RouteError } from '@src/other/classes';
import attendanceRepo from '@src/repos/attendance.repo';
import employeeRepo from '@src/repos/employee.repo';
import moment from 'moment';

// **** Variables **** //

const ATTENDANCE_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

class AttendanceService {
  // **** Functions **** //

  /**
   * Take attendance.
   */
  public async takeAttendance(shiftId: string, faceId: string) {
    const employee = await employeeRepo.getByFaceId(faceId);
    const attendance = await attendanceRepo.getByEmployeeAndShift(employee.id, shiftId);
    let result = 'You already take attendance';

    if (!attendance) {
      await this.createCheckIn(shiftId, employee.id);
      result = 'Check-in successfully';
    } else if (!attendance.checkOutTime) {
      await this.setCheckOut(attendance);
      result = 'Check-out successfully';
    }

    return result;
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
}

export default new AttendanceService();
