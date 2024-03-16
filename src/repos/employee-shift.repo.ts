import { EmployeeShift, IEmployeeShift } from '../models/EmployeeShift';
import { sequelize } from './sequelize.orm';

// **** Class **** //

class EmployeeShiftRepo {
  // **** Functions **** //

  /**
   * Get employee of a shift.
   */
  public async getEmployeeShiftByShiftId(shiftId: string) {
    const result = await EmployeeShift.findAll({
      where: {
        shiftId: shiftId,
      },
    }).then(function (records) {
      if (records) {
        const result: IEmployeeShift[] = [];
        records.forEach((record) => {
          result.push(record.dataValues);
        });
        return result;
      } else throw new Error('Error while getting record');
    });

    return result;
  }

  /**
   * Get specific employee of a shift.
   */
  public async getEmployeesOfShift(employeeId: string, shiftId: string) {
    const result = await EmployeeShift.findOne({
      where: {
        employeeId: employeeId,
        shiftId: shiftId,
      },
    });

    return result;
  }

  /**
   * Create record
   */
  public async create(employeeShift: IEmployeeShift) {
    const transaction = await sequelize.transaction();
    try {
      const result = await EmployeeShift.create(employeeShift, { transaction: transaction });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete record
   */
  public async delete(employeeShift: IEmployeeShift) {
    const transaction = await sequelize.transaction();
    try {
      const result = await EmployeeShift.destroy({
        where: {
          employeeId: employeeShift.employeeId,
          shiftId: employeeShift.shiftId,
        },
        transaction: transaction,
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

export default new EmployeeShiftRepo();
