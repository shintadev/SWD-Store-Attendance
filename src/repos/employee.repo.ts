import { Employee, IEmployee } from '../models/Employee';
import { sequelize } from './sequelize.orm';

// **** Type **** //

interface updateParams {
  name?:string,
  DOB?: string,
  phone?: string,
  address?: string,
  publicId?:string,
  rekognitionId?:string,
}

// **** Class **** //

class EmployeeRepo {
  // **** Functions **** //

  /**
   * Get list employees.
   */
  public async getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const result = await Employee.findAll({
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
   * Get all active employees.
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
   * Add one employee.
   */
  public async add(employee: IEmployee) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Employee.create(employee, { transaction: transaction });
      transaction.commit();

      return result.dataValues;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update an employee.
   */
  public async update(employee: IEmployee) {
    const transaction = await sequelize.transaction();
    try {
      const oldRecord = await Employee.findOne({
        where: { id: employee.id },
      }).then(function (employee) {
        if (employee) {
          return employee.dataValues;
        } else throw Error('Employee not found.');
      });

      const updateValues: updateParams = {};

      if (employee.name !== oldRecord.name) {
        updateValues.name = employee.name;
      } else if (employee.DOB !== oldRecord.DOB) {
        updateValues.DOB = employee.DOB;
      } else if (employee.phone !== oldRecord.phone) {
        updateValues.phone = employee.phone;
      } else if (employee.address !== oldRecord.address) {
        updateValues.address = employee.address;
      } else if (employee.publicId !== oldRecord.publicId) {
        updateValues.publicId = employee.publicId;
      } else if (employee.rekognitionId !== oldRecord.rekognitionId) {
        updateValues.rekognitionId = employee.rekognitionId;
      } else return null;

      const result = await Employee.update(updateValues, {
        where: {
          id: employee.id,
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
