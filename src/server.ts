/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import compression from 'compression';

import 'express-async-errors';

import BaseRouter from './routes/api';
import Paths from './constants/Paths';

import EnvVars from './constants/EnvVars';
import HttpStatusCodes from './constants/HttpStatusCodes';

import { NodeEnvs } from './constants/misc';
import { RouteError } from './other/classes';
import { setViews } from './util/view.util';

// **** Variables **** //

const app = express();

// **** Setup **** //

import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
const file = fs.readFileSync(path.resolve('swagger.yaml'), 'utf8');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const swaggerDocument = YAML.parse(file);
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
app.use(compression());

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


// ** Front-End Content ** //

setViews(app);


// **** Export default **** //

export default app;
