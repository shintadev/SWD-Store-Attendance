import HttpStatusCodes from '../constants/HttpStatusCodes';
import { Employee, IEmployee } from '../models/Employee';
import { RouteError } from '../other/classes';
import employeeRepo from '../repos/employee.repo';

// **** Variables **** //

const EMPLOYEE_NOT_FOUND_ERROR = 'Employee not found';
const EMPLOYEE_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

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
   * Get all employee.
   */
  public async getAll() {
    try {
      const result = await employeeRepo.getActive();

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ getAll ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * Get list employees.
   */
  public async getList(page: number, pageSize: number) {
    try {
      const employees = await employeeRepo.getList(page, pageSize);
      const total = await Employee.count();
      const totalPages = Math.ceil(total / pageSize);

      const result = { employees, total, totalPages };
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
  public async updateOne(id: string, name: string, DOB: Date, phone: string, address: string) {
    const persists = await employeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERROR);
    }
    try {
      const result = await employeeRepo.update(id, name, DOB, phone, address);
      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ updateOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * activate an employee by their id.
   */
  public async activateOne(id: string) {
    const persists = await employeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERROR);
    }
    try {
      const result = await employeeRepo.activate(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ _delete ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }

  /**
   * Inactivate an employee by their id.
   */
  public async inactivateOne(id: string) {
    const persists = await employeeRepo.persists(id);
    if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, EMPLOYEE_NOT_FOUND_ERROR);
    }
    try {
      const result = await employeeRepo.inactivate(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ _delete ~ error:', error);

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

  /**
   * getTotalEmps
   */
  public getTotalEmps() {
    try {
      const result = Employee.count({ where: { status: 'Active' } });

      return result;
    } catch (error) {
      console.log('🚀 ~ EmployeeService ~ getTotalEmps ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, EMPLOYEE_REQUEST_ERROR);
    }
  }
}
// **** Export default **** //

export default new EmployeeService();
