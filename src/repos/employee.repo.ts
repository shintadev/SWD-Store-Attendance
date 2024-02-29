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
    const employees = await Employee.findAll({
      where: {
        // status: 'Active',
      },
      offset: offset,
      limit: pageSize,
    });
    if (!employees) throw new Error('Error while getting record');

    const total = await Employee.count();
    const totalPages = Math.ceil(total / pageSize);

    const result = { employees, total, totalPages };

    return result;
  }

  /**
   * Get one employee.
   */
  public async getById(id: string): Promise<IEmployee> {
    const result = await Employee.findOne({
      where: {
        id: id,
        status: 'Active',
      },
    }).then(function (employee) {
      if (employee) {
        return employee;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * Get one employee by faceId.
   */
  public async getByFaceId(faceId: string): Promise<IEmployee> {
    const result = await Employee.findOne({
      where: {
        rekognitionId: faceId,
        status: 'Active',
      },
    }).then(function (employee) {
      if (employee) {
        return employee;
      } else throw new Error('Error while getting record');
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
  public async update(id: string, name: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.update(
        {
          name: name,
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
}

// **** Export default **** //

export default new EmployeeRepo();
