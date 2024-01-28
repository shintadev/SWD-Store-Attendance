import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IEmployee } from '@src/models/Employee';
import { RouteError } from '@src/other/classes';
import EmployeeRepo from '@src/repos/employee.repo';

// **** Variables **** //

export const EMPLOYEE_NOT_FOUND_ERR = 'Employee not found';

class EmployeeService {
  // **** Functions **** //

  /**
   * Get one employee.
   */
  public async getOne(id: string): Promise<IEmployee | null> {
    return EmployeeRepo.getOne(id);
  }

  /**
   * Get publicId by id.
   */
  public async getPublicId(id: string): Promise<string> {
    return EmployeeRepo.getPublicId(id);
  }

  /**
   * Add one employee.
   */
  public async addOne(employee: IEmployee): Promise<IEmployee> {
    try {
      const result = await EmployeeRepo.add(employee);
      console.log('🚀 ~ EmployeeService ~ addOne ~ result:', result);

      if (!result) throw new Error('Fail to add to db');
      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ addOne ~ error:');

      throw error;
    }
  }

  /**
   * Update an employee.
   */
  public async updateOne(id: string, name: string): Promise<void> {
    const persists = await EmployeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERR);
    }
    // Return user
    return await EmployeeRepo.update(id, name);
  }

  /**
   * Delete an employee by their id.
   */
  public async _delete(id: string): Promise<void> {
    const persists = await EmployeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERR);
    }
    // Delete an employee
    return await EmployeeRepo.delete(id);
  }
}
// **** Export default **** //

export default new EmployeeService();
