import { sequelize } from '../repos/sequelize.orm';
import { generateId } from '../util/misc';
import { DataTypes, Model } from 'sequelize';

// **** Types **** //

export interface IEmployee {
  id: string;
  name: string;
  DOB: string;
  phone: string;
  address: string;
  status?: string;
  publicId: string;
  rekognitionId: string;
}

interface EmployeeModel extends Model<IEmployee>, IEmployee {}

// **** Models **** //

export const Employee = sequelize.define<EmployeeModel>(
  'employee',
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DOB: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    publicId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rekognitionId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    // tableName: 'employee',
    // freezeTableName: true,
    // paranoid: true,
  }
);

// **** Functions **** //

/**
 * Create new IEmployee.
 */
function new_(
  name: string,
  DOB: string,
  phone: string,
  address: string,
  publicId: string,
  rekognitionId: string
): IEmployee {
  return {
    id: generateId(name),
    name: name,
    DOB: DOB,
    phone: phone,
    address: address,
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
