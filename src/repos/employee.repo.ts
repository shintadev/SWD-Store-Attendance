import { IEmployee } from '../models/Employee';
import SequelizeORM, { EmployeeModel } from './sequelize.orm';

// **** Variables **** //

const orm = SequelizeORM;

class EmployeeRepo {
  // **** Functions **** //

  /**
   * Convert type EmployeeModel to type IEmployee.
   */
  public toIEmployee(model: EmployeeModel): IEmployee {
    const id = model.id;
    const name = model.name;
    const status = model.status;
    const publicId = model.publicId;
    const rekognitionId = model.rekognitionId;
    const result: IEmployee = { id, name, status, publicId, rekognitionId };
    return result;
  }

  /**
   * Get one employee.
   */
  public async getById(id: string): Promise<IEmployee> {
    const result = await orm.Employee.findOne({
      where: {
        id: id,
        status: 'Active',
      },
    }).then(function (employee) {
      if (employee) {
        return EmployeeRepo.prototype.toIEmployee(employee);
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * Get one employee by faceId.
   */
  public async getByFaceId(faceId: string): Promise<IEmployee> {
    const result = await orm.Employee.findOne({
      where: {
        rekognitionId: faceId,
        status: 'Active',
      },
    }).then(function (employee) {
      if (employee) {
        return EmployeeRepo.prototype.toIEmployee(employee);
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * See if an employee with the given id exists.
   */
  public async persists(id: string): Promise<boolean> {
    const employee = await orm.Employee.findAll({
      where: { id: id },
    });
    if (employee) return true;
    else return false;
  }

  /**
   * Add one employee.
   */
  public async add(employee: IEmployee): Promise<IEmployee> {
    const employeeModel = await orm.Employee.create(employee).then(function (employee) {
      return employee;
    });
    const result = await this.getById(employeeModel.id);
    return result;
  }

  /**
   * Update an employee.
   */
  public async update(id: string, name: string) {
    return await orm.Employee.update(
      {
        name: name,
      },
      {
        where: {
          id: id,
        },
      }
    );
  }

  /**
   * Delete one employee.
   */
  public async delete(id: string) {
    return await orm.Employee.update(
      {
        status: 'Inactive',
      },
      {
        where: {
          id: id,
        },
      }
    );
  }
}

// **** Export default **** //

export default new EmployeeRepo();
