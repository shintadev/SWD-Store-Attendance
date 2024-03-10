import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import { Router, json } from 'express';
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

// **** Variables **** //

const upload = multer();

// **** Types **** //

export interface FaceRequest {
  img?: File;
}

export interface EmployeeRequest {
  id?: string;
  name?: string;
  DOB?: Date;
  phone?: string;
  address?: string;
}

export interface EmployeesRequest {
  page?: number;
  pageSize?: number;
}

// **** Resolvers **** //

const employeeResolvers = {
  /**
   * Get one employee.
   */
  getOne: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const id = String(req.query.id);
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
   * Get list employees.
   */
  getList: async (req: IReq<EmployeesRequest>, res: IRes) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await employeeService.getList(page, pageSize);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: result,
    });
  },

  /**
   * Add one employee.
   */
  add: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { name, DOB, phone, address } = req.body;

    const img = req.file;
    if (!name || !DOB || !phone || !address) {
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

      const employee: IEmployee = Employee.new(name, DOB, phone, address, publicId, face.FaceId);

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
  delete: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id } = req.body;

    if (!id) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please input all necessary fields');
    }
    const result = await employeeService.deleteOne(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Deleted successfully',
      data: result,
    });
  },
};

// **** Routes **** //

employeeRouter.use(json({ limit: '10mb' }));

employeeRouter
  .route(Paths.Employee.CRUD)
  .get(upload.none(), asyncHandler(employeeResolvers.getOne)) // Get one employee
  .post(upload.single('file'), asyncHandler(employeeResolvers.add)) // Add one employee
  .put(upload.none(),asyncHandler(employeeResolvers.update)) // Update one employee
  .delete(upload.none(),asyncHandler(employeeResolvers.delete)); // Delete one employee

employeeRouter
  .route(Paths.Employee.List)
  .get(upload.none(),asyncHandler(employeeResolvers.getList)); //Get list employees

// **** Export default **** //

export default employeeRouter;
