import { EmployeeShift, IEmployeeShift } from '@src/models/EmployeeShift';
import { sequelize } from './sequelize.orm';

class EmployeeShiftRepo {
  /**
   * Get employee of a shift.
   */
  public async getEmployeesOfShift(shiftId: string) {
    const result = await EmployeeShift.findAll({
      where: {
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
