import { Router } from 'express';

import Paths from '../constants/Paths';
import employeeRouter from './employee.route';
import shiftRouter from './shift.route';
import attendanceRouter from './attendance.route';

// **** Router **** //

const apiRouter = Router();

// Add EmployeeRouter
apiRouter.use(Paths.Employees.Base, employeeRouter);

// Add ShiftRouter
apiRouter.use(Paths.Shift.Base, shiftRouter);

// Add AttendanceRouter
apiRouter.use(Paths.Attendance.Base, attendanceRouter);

// **** Export default **** //


export default apiRouter;