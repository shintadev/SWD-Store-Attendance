import { generateId } from '@src/util/misc';

// **** Variables **** //

// **** Types **** //

export interface IEmployee {
  id: string;
  name: string;
  status: string;
  publicId: string;
  rekognitionId: string;
}

// **** Functions **** //

/**
 * Create new Employee.
 */
function new_(name: string, publicId: string, rekognitionId: string): IEmployee {
  return {
    id: generateId(name),
    name: name,
    publicId: publicId,
    rekognitionId: rekognitionId,
    status: 'Active',
  };
}

/**
 * See if the param meets criteria to be a Employee.
 */
function isEmployee(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg &&
    'name' in arg &&
    'publicId' in arg &&
    'rekognitionId' in arg &&
    'status' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  isEmployee,
} as const;
