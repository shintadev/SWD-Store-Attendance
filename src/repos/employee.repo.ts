import { Employee, IEmployee } from '../models/Employee';
import { sequelize } from './sequelize.orm';

// **** Class **** //

class EmployeeRepo {
  // **** Functions **** //

  /**
   * Get list employee.
   */
  public async getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const result = await Employee.findAll({
      where: {
        // status: 'Active',
      },
      offset: offset,
      limit: pageSize,
    }).then(function (employees) {
      if (employees) {
        const result: IEmployee[] = [];
        employees.forEach((employee) => {
          result.push(employee.dataValues);
        });
        return result;
      } else return null;
    });

    return result;
  }

  /**
   * Get all active employee.
   */
  public async getActive() {
    const result = await Employee.findAll({
      where: {
        status: 'Active',
      },
    }).then(function (employees) {
      if (employees) {
        const result: IEmployee[] = [];
        employees.forEach((employee) => {
          result.push(employee.dataValues);
        });
        return result;
      } else return null;
    });

    return result;
  }

  /**
   * Get one employee.
   */
  public async getById(id: string) {
    const result = await Employee.findOne({
      where: {
        id: id,
        status: 'Active',
      },
    }).then(function (employee) {
      if (employee) {
        return employee.dataValues;
      } else return null;
    });
    return result;
  }

  /**
   * Get one employee by faceId.
   */
  public async getByFaceId(faceId: string) {
    const result = await Employee.findOne({
      where: {
        rekognitionId: faceId,
        status: 'Active',
      },
    }).then(function (employee) {
      if (employee) {
        return employee.dataValues;
      } else return null;
    });
    return result;
  }

  /**
   * See if an employee with the given id exists.
   */
  public async persists(id: string): Promise<boolean> {
    const employee = await Employee.findOne({
      where: { id: id },
    });
    if (employee) return true;
    else return false;
  }

  /**
   * Add one employee.
   */
  public async add(employee: IEmployee): Promise<IEmployee> {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.create(employee, { transaction: transaction });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update an employee.
   */
  public async update(id: string, name: string, DOB: Date, phone: string, address: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.update(
        {
          name: name,
          DOB: DOB,
          phone: phone,
          address: address,
        },
        {
          where: {
            id: id,
          },
          transaction: transaction,
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
   * Activate one employee.
   */
  public async activate(id: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.update(
        {
          status: 'Active',
        },
        {
          where: {
            id: id,
          },
          transaction: transaction,
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
   * Inactivate one employee.
   */
  public async inactivate(id: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.update(
        {
          status: 'Inactive',
        },
        {
          where: {
            id: id,
          },
          transaction: transaction,
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
   * Delete one employee.
   */
  public async delete(id: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.destroy({
        where: {
          id: id,
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

export default new EmployeeRepo();
