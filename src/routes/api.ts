import { Router } from 'express';

import Paths from '../constants/Paths';
import employeeRouter from './employee.route';
import shiftRouter from './shift.route';
import attendanceRouter from './attendance.route';
import userRouter from './user.route';
import authRouter from './auth.route';
import { isAdmin, isAuthenticated } from '@src/middlewares/auth.middleware';

// **** Router **** //

const apiRouter = Router();

// Add EmployeeRouter
apiRouter.use(Paths.Employees.Base, isAuthenticated, employeeRouter);

// Add ShiftRouter
apiRouter.use(Paths.Shift.Base, isAuthenticated, shiftRouter);

// Add AttendanceRouter
apiRouter.use(Paths.Attendance.Base, attendanceRouter);

// Add UserRouter
apiRouter.use(Paths.User.Base, isAuthenticated, isAdmin, userRouter);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// **** Export default **** //

export default apiRouter;