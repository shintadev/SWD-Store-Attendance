import { IEmployee } from '../models/Employee';
import SequelizeORM from './sequelize.orm';

// **** Variables **** //

const orm = SequelizeORM;

// **** Functions **** //

/**
 * Get one employee.
 */
async function getOne(id: string): Promise<IEmployee | null> {
  const result = await orm.Employee.findOne({
    where: {
      id: id,
      status: 'Active',
    },
  }).then(function (employee) {
    if (employee != null) {
      const id = employee.get('id');
      const name = employee.get('name');
      const status = employee.get('status');
      const publicId = employee.get('publicId');
      const rekognitionId = employee.get('rekognitionId');
      const employeeData: IEmployee = { id, name, status, publicId, rekognitionId };
      return employeeData;
    }
    return null;
  });
  return result;
}

/**
 * Get publicId.
 */
async function getPublicId(id: string): Promise<string> {
  const result = await orm.Employee.findOne({
    where: {
      id: id,
      status: 'Active',
    },
  }).then(function (employee) {
    if (employee != null) {
      const publicId = employee.get('publicId');
      return publicId;
    }
    throw new Error();
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
  return employee != null;
}

/**
 * Add one employee.
 */
async function add(employee: IEmployee): Promise<IEmployee | null> {
  try {
    const emplyeModel = await orm.Employee.create(employee).then(function (employee) {
      return employee;
    });
    return getOne(emplyeModel.id);
  } catch (error) {
    console.log('🚀 repo ~ add ~ error:');
    throw error;
  }
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
  getOne,
  persists,
  getPublicId,
  add,
  update,
  delete: delete_,
} as const;
