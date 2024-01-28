import { Router } from 'express';

import Paths from '../constants/Paths';
import employeeRouter from './employee.route';

// **** Router **** //

const apiRouter = Router();

// Add EmployeeRouter

apiRouter.use(Paths.Employees.Base, employeeRouter);

// **** Export default **** //

export default apiRouter;


