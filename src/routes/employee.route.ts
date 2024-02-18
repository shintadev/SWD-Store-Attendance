import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import { Router } from 'express';
import Paths from '../constants/Paths';
import Employee, { IEmployee } from '@src/models/Employee';
import imageService from '../services/image.service';
import { asyncHandler } from '../util/misc';
import fileService from '@src/services/file.service';
import employeeService from '@src/services/employee.service';
import multer from 'multer';
import { RouteError } from '@src/other/classes';

// ** Add Router ** //

const employeeRouter = Router();
const upload = multer();

// **** Types **** //

export interface FaceRequest {
  img?: File;
}

export interface EmployeeRequest {
  id?: string;
  name?: string;
}

// **** Resolvers **** //

const employeeResolvers = {
  /**
   * Get one employee.
   */
  getOne: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const employee = await employeeService.getOne(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: employee,
    });
  },

  /**
   * Add one employee.
   */
  add: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { name } = req.body;
    const img = req.file;
    if (!name) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    if (!img) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please upload a file');
    }
    const imgBuffer = img.buffer;
    try {
      // Index faces using Rekognition
      const face = await imageService.indexFace(imgBuffer.toString('base64'));
      if (!face.FaceId) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Face info not found');

      const publicId = await fileService.uploadToCloud(imgBuffer);

      const employee: IEmployee = Employee.new(name, publicId, face.FaceId);

      const result = await employeeService.addOne(employee);

      return res.status(HttpStatusCodes.CREATED).json({
        message: 'Create successfully',
        data: { id: result.id },
      });
    } catch (error) {
      if (error instanceof Error) {
        let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        if (error instanceof RouteError) {
          status = error.status;
        }
        throw new RouteError(status, error.message);
      }
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'UNDEFINED_ERROR');
    }
  },

  /**
   * Update one employee.
   */
  update: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id, name } = req.body;
    if (!id || !name) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const result = await employeeService.updateOne(id, name);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Update successfully',
      data: result,
    });
  },

  /**
   * Delete one employee.
   */
  delete_: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id } = req.body;
    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const result = await employeeService._delete(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Deleted successfully',
      data: result,
    });
  },
};

// **** Routes **** //

employeeRouter
  .route(Paths.Employees.CRUD)
  .get(asyncHandler(employeeResolvers.getOne)) // Get one employee
  .post(upload.single('file'), employeeResolvers.add) // Add one employee
  .put(asyncHandler(employeeResolvers.update)) // Update one employee
  .delete(asyncHandler(employeeResolvers.delete_)); // Delete one employee

// **** Export default **** //

export default employeeRouter;
