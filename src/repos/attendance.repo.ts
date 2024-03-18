import { Attendance, IAttendance } from '../models/Attendance';
import { sequelize } from './sequelize.orm';

// **** Class **** //

class AttendanceRepo {
  // **** Functions **** //

  /**
   * Get employee's attendance list.
   */
  public async getByEmployeeId(employeeId: string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const result = await Attendance.findAll({
      where: {
        employeeId: employeeId,
      },
      offset: offset,
      limit: pageSize,
    }).then(function (attendances) {
      if (attendances) {
        const output: IAttendance[] = [];
        attendances.forEach((attendance) => {
          output.push(attendance.dataValues);
        });
        return output;
      } else throw new Error('Error while getting records');
    });
    return result;
  }

  /**
   * Get employee's attendance list.
   */
  public async getByShiftId(shiftId: string) {
    const result = await Attendance.findAll({
      where: {
        shiftId: shiftId,
      },
    }).then(function (attendances) {
      if (attendances) {
        const output: IAttendance[] = [];
        attendances.forEach((attendance) => {
          output.push(attendance.dataValues);
        });
        return output;
      } else throw new Error('Error while getting records');
    });
    return result;
  }

  /**
   * Get employee's shift attendance.
   */
  public async getByEmployeeAndShift(employeeId: string, shiftId: string) {
    const result = await Attendance.findOne({
      where: {
        employeeId: employeeId,
        shiftId: shiftId,
      },
    }).then(function (attendance) {
      if (attendance) {
        return attendance.dataValues;
      } else return null;
    });
    return result;
  }

  /**
   * Create new attendance.
   */
  public async create(attendance: IAttendance) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Attendance.create(attendance, { transaction: transaction }).then(
        function (shift) {
          return shift;
        }
      );
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update attendance.
   */
  public async update(attendance: IAttendance) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Attendance.update(
        {
          checkOutTime: attendance.checkOutTime,
        },
        {
          where: {
            shiftId: attendance.shiftId,
            employeeId: attendance.employeeId,
          },
          transaction: transaction,
        }
      ).then(function (shift) {
        return shift;
      });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}

// **** Export default **** //

export default new AttendanceRepo();
