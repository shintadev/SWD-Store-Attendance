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
  img: File;
}

export interface EmployeeRequest {
  id: string;
  name: string;
}

// **** Resolvers **** //

const employeeResolvers = {
  /**
   * Get one employee.
   */
  getOne: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id } = req.body;
    const employee = await employeeService.getOne(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Request handled',
      data: employee,
    });
  },

  /**
   * Detect face in image.
   */
  detect: async (req: IReq<FaceRequest>, res: IRes) => {
    const img = req.file;
    if (!img) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please upload a file');
    }
    const imgBuffer = img.buffer.toString('base64');

    // Index faces using Rekognition
    const faces = await imageService.indexFace(imgBuffer);

    // Prepare response with face details
    if (typeof faces.FaceRecords === 'undefined')
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Can not detect any face');
    const faceRecord = faces.FaceRecords[0];
    const faceDetail = faceRecord.Face;

    return res.status(HttpStatusCodes.OK).json({
      message: 'Face detected',
      data: {
        FaceId: faceDetail?.FaceId,
        BoundingBox: faceDetail?.BoundingBox,
      },
    });
  },

  /**
   * Search face by image.
   */
  attendance: async (req: IReq<FaceRequest>, res: IRes) => {
    const img = req.file;
    if (!img) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please upload a file');
    }
    const imgBuffer = img.buffer.toString('base64');

    // Search faces in Rekognition collection
    const faces = await imageService.searchFace(imgBuffer);

    // Prepare response with face details
    if (typeof faces.FaceMatches === 'undefined')
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Can not detect any face');
    const faceMatch = faces.FaceMatches[0];
    const faceDetail = faceMatch.Face;

    return res.status(HttpStatusCodes.OK).json({
      message: 'Face match',
      data: {
        FaceId: faceDetail?.FaceId,
        Confidence: faceMatch.Similarity,
        BoundingBox: faces.SearchedFaceBoundingBox,
      },
    });
  },

  /**
   * Add one employee.
   */
  add: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { name } = req.body;
    const img = req.file;
    if (!img) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Please upload a file');
    }
    const imgBuffer = img.buffer;
    try {
      // Index faces using Rekognition
      const faces = await imageService.indexFace(imgBuffer.toString('base64'));

      // Prepare response with face details
      if (typeof faces.FaceRecords === 'undefined') throw new Error('Can not detect any face');
      const faceRecord = faces.FaceRecords[0];
      if (typeof faceRecord.Face === 'undefined') throw new Error('Can not detect any face');
      const faceId = faces.FaceRecords[0].Face?.FaceId;
      if (typeof faceId === 'undefined') throw new Error('Can not detect any face');

      const publicId = await fileService.uploadToCloud(imgBuffer);
      const employee: IEmployee = Employee.new(name, publicId, faceId);

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
    await employeeService.updateOne(id, name);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Update successfully',
      data: {},
    });
  },

  /**
   * Delete one employee.
   */
  delete_: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id } = req.body;
    await employeeService._delete(id);

    return res.status(HttpStatusCodes.OK).json({
      message: 'Deleted successfully',
      data: {},
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

employeeRouter
  .route(Paths.Employees.Attendance)
  .post(upload.single('file'), asyncHandler(employeeResolvers.attendance)); // Search face by image

// **** Export default **** //

export default employeeRouter;
