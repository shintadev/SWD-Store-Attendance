import { sequelize } from '@src/repos/sequelize.orm';
import { DataTypes, Model } from 'sequelize';
import { Employee } from './Employee';
import { nanoid } from 'nanoid';

// **** Variables **** //

const userRole = ['ADMIN', 'MANAGER'];

// **** Types **** //

export interface IUser {
  id: string;
  password: string;
  role: string;
}

export interface UserModel extends Model<IUser>, IUser {}

// **** Models **** //

export const User = sequelize.define<UserModel>('user', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      async exist(value: string) {
        const employee = await Employee.findByPk(value);
        if (!employee) {
          throw new Error('Invalid EmployeeId');
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      valid(value: string) {
        if (!value || value.length < 8) {
          throw new Error('Invalid Password');
        }
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      valid(value: string) {
        if (!value || !userRole.includes(value)) {
          throw new Error('Invalid Role');
        }
      },
    },
  },
});

// **** Relationship **** //

// Employee 1:1 User
Employee.hasOne(User, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
User.belongsTo(Employee, {
  foreignKey: 'id',
  targetKey: 'id',
});

// **** Functions **** //

/**
 * Create new Attendance.
 */
function new_(id: string, password?: string, role?: string): IUser {
  return {
    id: id,
    password: password ?? nanoid(8),
    role: role ?? 'MANAGER',
  };
}

// **** Export default **** //

export default {
  new: new_,
} as const;
