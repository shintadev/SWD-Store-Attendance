import { IEmployee } from '../models/Employee';
import SequelizeORM, { EmployeeModel } from './sequelize.orm';

// **** Variables **** //

const orm = SequelizeORM;

// **** Functions **** //

/**
 * Convert type EmployeeModel to type IEmployee.
 */
function toIEmployee(model: EmployeeModel) {
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
async function getById(id: string): Promise<IEmployee> {
  const result = await orm.Employee.findOne({
    where: {
      id: id,
      status: 'Active',
    },
  }).then(function (employee) {
    if (employee != null) {
      return toIEmployee(employee);
    } else throw new Error();
  });
  return result;
}

/**
 * See if a employee with the given id exists.
 */
async function persists(id: string): Promise<boolean> {
  const employee = await orm.Employee.findAll({
    where: { id: id },
  });
  if (employee) return true;
  else return false;
}

/**
 * Add one employee.
 */
async function add(employee: IEmployee): Promise<IEmployee> {
  const employeeModel = await orm.Employee.create(employee).then(function (employee) {
    return employee;
  });
  const result = await getById(employeeModel.id);
  return result;
}

/**
 * Update an employee.
 */
async function update(id: string, name: string): Promise<void> {
  await orm.Employee.update(
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
async function delete_(id: string): Promise<void> {
  await orm.Employee.update(
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

// **** Export default **** //

export default {
  getById,
  persists,
  add,
  update,
  delete: delete_,
} as const;
