import { Express, Request, Response } from 'express';
import path from 'path';
import express from 'express';
import Paths from '@src/constants/Paths';
import { isAdmin, isAuthenticated } from '@src/middlewares/auth.middleware';

const AUTHENTICATE_FAILED_HTML =
  '<div id=\'error\'>Need Login First</div><script src="scripts/script.js"></script>';

export const setViews = (app: Express) => {
  // Set views directory (html)
  const viewsDir = path.join('src/', 'views');
  app.set('views', viewsDir);

  const attendanceDir = path.join(viewsDir, 'attendanceViews');
  const authDir = path.join(viewsDir, 'authViews');
  const employeeDir = path.join(viewsDir, 'employeeViews');
  const shiftDir = path.join(viewsDir, 'shiftViews');
  const userDir = path.join(viewsDir, 'userViews');

  // Set static directory (js and css).
  const staticDir = path.join('src/', 'public');
  app.use(express.static(staticDir));

  // Nav to home page by default
  app.get('/', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.redirect('/admin');
    } catch (error) {
      return res.redirect('/home');
    }
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
  app.get(Paths.Auth.Login, (_: Request, res: Response) => {
    return res.sendFile('login.html', { root: authDir });
  });

  //Admin
  app.get('/admin', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      await isAdmin(req, res);
      return res.sendFile('admin.html', { root: viewsDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //Employee
  app.get(Paths.Employee.Base, async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.sendFile('employees.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Employee.Base + '/form/add', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.sendFile('employeeAdd.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Employee.Base + '/form/update', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.sendFile('employeeUpdate.html', { root: employeeDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //Shift
  app.get(Paths.Shift.Base, async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.sendFile('schedule.html', { root: shiftDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Shift.Base + '/form/add', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.sendFile('shiftAdd.html', { root: shiftDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.Shift.Base + '/form/update', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      return res.sendFile('shiftUpdate.html', { root: shiftDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  //User
  app.get(Paths.User.Base, async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      await isAdmin(req, res);
      return res.sendFile('users.html', { root: userDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.User.Base + '/form/add', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      await isAdmin(req, res);
      return res.sendFile('userAdd.html', { root: userDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });

  app.get(Paths.User.Base + '/form/update', async (req: Request, res: Response) => {
    try {
      await isAuthenticated(req, res);
      await isAdmin(req, res);
      return res.sendFile('userUpdate.html', { root: userDir });
    } catch (error) {
      return res.status(401).send(AUTHENTICATE_FAILED_HTML);
    }
  });
};
