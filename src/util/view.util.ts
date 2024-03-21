import { Express, Request, Response } from 'express';
import path from 'path';
import express from 'express';
import Paths from '../constants/Paths';

const AUTHENTICATE_FAILED_HTML =
  '<div id=\'error\'>Need Login First</div><script src="/scripts/script.js"></script>';

export const setViews = (app: Express) => {
  // Set views directory (html)
  const viewsDir = path.resolve(__dirname, '../views');
  app.set('views', viewsDir);

  const attendanceDir = path.join(viewsDir, 'attendanceViews');
  const authDir = path.join(viewsDir, 'authViews');
  const employeeDir = path.join(viewsDir, 'employeeViews');
  const shiftDir = path.join(viewsDir, 'shiftViews');
  const userDir = path.join(viewsDir, 'userViews');
  const storeDir = path.join(viewsDir, 'storeViews');

  // Set static directory (js and css).
  const staticDir = path.join(__dirname, '../public');
  app.use(express.static(staticDir));

  // Nav to home page by default
  app.get('/', (req: Request, res: Response) => {
    return res.redirect('/home');
  });

  app.get('/home', (_: Request, res: Response) => {
    return res.sendFile('index.html', { root: viewsDir });
  });

  // *** Redirect routes *** //

  //Attendance
  app.get(Paths.Attendance.Base, (_: Request, res: Response) => {
    return res.sendFile('attendance.html', { root: attendanceDir });
  });

  //Auth
  app.get(Paths.Auth.Login, (req: Request, res: Response) => {
    try {
      return res.redirect('/dashboard');
    } catch (error) {
      return res.sendFile('login.html', { root: authDir });
    }
  });

  //Dashboard
  app.get('/dashboard', (req: Request, res: Response) => {
    try {
      return res.sendFile('dashboard.html', { root: viewsDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //Employee
  app.get(Paths.Employee.Base, (req: Request, res: Response) => {
    try {
      return res.sendFile('employees.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Employee.Base + '/add', (req: Request, res: Response) => {
    try {
      return res.sendFile('employeeAdd.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Employee.Base + '/detail', (req: Request, res: Response) => {
    try {
      return res.sendFile('employeeDetail.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Employee.Base + '/attendance-report', (req: Request, res: Response) => {
    try {
      return res.sendFile('employeeReport.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //Shift
  app.get(Paths.Shift.Schedule, (req: Request, res: Response) => {
    try {
      return res.sendFile('schedule.html', { root: shiftDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Shift.Base + '/add', (req: Request, res: Response) => {
    try {
      return res.sendFile('shiftAdd.html', { root: shiftDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Shift.Base + '/detail', (req: Request, res: Response) => {
    try {
      return res.sendFile('shiftDetail.html', { root: shiftDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //User
  app.get(Paths.User.Base, (req: Request, res: Response) => {
    try {
      return res.sendFile('users.html', { root: userDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.User.Base + '/add', (req: Request, res: Response) => {
    try {
      return res.sendFile('userAdd.html', { root: userDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.User.Base + '/update', (req: Request, res: Response) => {
    try {
      return res.sendFile('userUpdate.html', { root: userDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //Store
  app.get(Paths.Store.Base, (req: Request, res: Response) => {
    try {
      return res.sendFile('store.html', { root: storeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });
};
