import { IAttendance } from '@src/models/Attendance';
import SequelizeORM from './sequelize.orm';

// **** Variables **** //

const orm = SequelizeORM;

class AttendanceRepo {
  // **** Functions **** //

  /**
   * Get employee's attendance list.
   */
  public async getByEmployeeId(employeeId: string) {
    const result = await orm.Attendance.findAll({
      where: {
        employeeId: employeeId,
      },
    }).then(function (checkIn) {
      if (checkIn) {
        return checkIn;
      } else throw new Error('Error while getting records');
    });
    return result;
  }

  /**
   * Get employee's shift attendance.
   */
  public async getByEmployeeAndShift(employeeId: string, shiftId: string) {
    const result = await orm.Attendance.findOne({
      where: {
        employeeId: employeeId,
        shiftId: shiftId,
      },
    }).then(function (attendance) {
      if (attendance) {
        return attendance;
      } else throw new Error('Error while getting records');
    });
    return result;
  }

  /**
   * Create new attendance.
   */
  public async create(attendance: IAttendance) {
    const result = await orm.Attendance.create(attendance).then(function (shift) {
      return shift;
    });
    return result;
  }

  /**
   * Update attendance.
   */
  public async update(attendance: IAttendance) {
    const result = await orm.Attendance.update(
      {
        checkOutTime: attendance.checkOutTime,
      },
      {
        where: {
          shiftId: attendance.shiftId,
          employeeId: attendance.employeeId,
        },
      }
    ).then(function (shift) {
      return shift;
    });
    return result;
  }
}

// **** Export default **** //

export default new AttendanceRepo();
