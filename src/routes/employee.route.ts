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
  faceId: string;
}

// **** Resolvers **** //

const employeeResolvers = {
  /**
   * Get one employee.
   */
  getOne: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const id = req.params.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const employee = await employeeService.getOne(id);
    return res.status(HttpStatusCodes.OK).json({ employee });
  },

  /**
   * Detect face in image.
   */
  detect: async (req: IReq<FaceRequest>, res: IRes) => {
    const img = req.file;
    if (!img) {
      const error = new Error('Please upload a file');
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'Updated Error',
        data: { error },
      });
    }
    const imgBuffer = img.buffer.toString('base64');

    // Index faces using Rekognition
    const faces = await imageService.indexFace(imgBuffer);

    // Prepare response with face details
    if (typeof faces.FaceRecords === 'undefined') throw new Error();
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
  search: async (req: IReq<FaceRequest>, res: IRes) => {
    const img = req.file;
    if (!img) {
      const error = new Error('Please upload a file');
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'Updated Error',
        data: { error },
      });
    }
    const imgBuffer = img.buffer.toString('base64');
    console.log('object');
    // Search faces in Rekognition collection
    const faces = await imageService.searchFace(imgBuffer);
    console.log('hello');
    // Prepare response with face details
    if (typeof faces.FaceMatches === 'undefined') throw new Error();
    const faceMatch = faces.FaceMatches[0];
    const faceDetail = faceMatch.Face;

    return res.status(HttpStatusCodes.OK).json({
      message: 'Face detected',
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
    try {
      const { name, faceId } = req.body;
      const img = req.file;
      if (!img) {
        const error = new Error('Please upload a file');
        return res.status(HttpStatusCodes.OK).json({
          message: 'File Error',
          data: { error },
        });
      }
      const imgBuffer = img.buffer;

      const publicId = await fileService.uploadToCloud(imgBuffer);

      const employee: IEmployee = Employee.new(name, publicId, faceId);
      console.log('🚀 ~ add: ~ employee:', employee);

      const result = await employeeService.addOne(employee);
      console.log('🚀 ~ add: ~ result:', result);

      return res.status(HttpStatusCodes.CREATED).json({
        message: 'Created successfully',
        data: { result },
      });
    } catch (error) {
      console.log('🚀 ~ add ~ error:');

      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'Add Error',
        data: {},
      });
    }
  },

  /**
   * Update one employee.
   */
  update: async (req: IReq<EmployeeRequest>, res: IRes) => {
    const { id, name } = req.body;
    await employeeService.updateOne(id, name);
    return res.status(HttpStatusCodes.OK).json({
      message: 'Updated successfully',
      data: {},
    });
  },

  /**
   * Delete one employee.
   */
  delete_: async (req: IReq<EmployeeRequest>, res: IRes) => {
    try {
      const id = req.params.id;
      await employeeService._delete(id);
      return res.status(HttpStatusCodes.OK).json({
        message: 'Deleted successfully',
        data: {},
      });
    } catch (error) {
      console.log('🚀 ~ delete_: ~ error:', error);

      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'Add Error',
        data: {},
      });
    }
  },
};

// **** Routes **** //

// Get one employee
employeeRouter.get(Paths.Employees.Get, asyncHandler(employeeResolvers.getOne));

// Search face by image
employeeRouter.get(
  Paths.Employees.Face,
  upload.single('file'),
  asyncHandler(employeeResolvers.search)
);

// Detect face in image
employeeRouter.post(
  Paths.Employees.Face,
  upload.single('file'),
  asyncHandler(employeeResolvers.detect)
);

// Add one employee
employeeRouter.post(
  Paths.Employees.Add,
  upload.single('file'),
  asyncHandler(employeeResolvers.add)
);

// Update one employee
employeeRouter.put(Paths.Employees.Update, asyncHandler(employeeResolvers.update));

// Delete one employee
employeeRouter.delete(Paths.Employees.Delete, asyncHandler(employeeResolvers.delete_));

// **** Export default **** //

export default employeeRouter;
