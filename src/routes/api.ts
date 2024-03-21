import { Request, Response, Router } from 'express';

import Paths from '../constants/Paths';
import employeeRouter from './employee.route';
import shiftRouter from './shift.route';
import attendanceRouter from './attendance.route';
import userRouter from './user.route';
import authRouter from './auth.route';
import { isAuthenticated } from '../middlewares/auth.middleware';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import employeeService from '../services/employee.service';
import userService from '../services/user.service';
import attendanceService from '../services/attendance.service';
import storeRouter from './store.route';

// **** Router **** //

const apiRouter = Router();

// Add AttendanceRouter
apiRouter.use(Paths.Attendance.Base, attendanceRouter);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// Add EmployeeRouter
apiRouter.use(Paths.Employee.Base, employeeRouter);

// Add ShiftRouter
apiRouter.use(Paths.Shift.Base, shiftRouter);

// Add UserRouter
apiRouter.use(Paths.User.Base, userRouter);

// Add StoreRouter
apiRouter.use(Paths.Store.Base, storeRouter);

apiRouter.route(Paths.Dashboard.Base).get(isAuthenticated, async (_: Request, res: Response) => {
  const totalEmps = await employeeService.getTotalEmps();
  const totalUsers = await userService.getTotalUsers();
  const attendanceRate = await attendanceService.getAttendanceRate();
  res.status(HttpStatusCodes.OK).json({
    message: 'Request handled',
    totalEmps: totalEmps,
    totalUsers: totalUsers,
    attendanceRate: attendanceRate,
  });
});

// **** Export default **** //

export default apiRouter;
