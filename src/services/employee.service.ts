import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IEmployee } from '@src/models/Employee';
import { RouteError } from '@src/other/classes';
import employeeRepo from '@src/repos/employee.repo';

// **** Variables **** //

const EMPLOYEE_NOT_FOUND_ERROR = 'Employee not found';
const EMPLOYEE_REQUEST_ERROR = 'Request can not be handle';

class EmployeeService {
  // **** Functions **** //

  /**
   * Get one employee.
   */
  public async getOne(id: string): Promise<IEmployee> {
    try {
      const result = await employeeRepo.getById(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ getOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * Get list employees.
   */
  public async getList(page: number, pageSize?: number) {
    try {
      const result = await employeeRepo.getList(page, pageSize ?? 10);

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ getOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * Add one employee.
   */
  public async addOne(employee: IEmployee): Promise<IEmployee> {
    try {
      const result = await employeeRepo.add(employee);

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ addOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * Update an employee.
   */
  public async updateOne(id: string, name: string) {
    const persists = await employeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERROR);
    }
    try {
      const result = await employeeRepo.update(id, name);
      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ updateOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * Delete an employee by their id.
   */
  public async deleteOne(id: string) {
    const persists = await employeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERROR);
    }
    try {
      const result = await employeeRepo.delete(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ _delete ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }
}
// **** Export default **** //

export default new EmployeeService();
