import { sequelize } from '../repos/sequelize.orm';
import { DataTypes, Model } from 'sequelize';
import { Employee } from './Employee';
import { Shift } from './Shift';

// **** Types **** //

export interface IAttendance {
  checkInTime: string;
  checkOutTime?: string;
  shiftId: string;
  employeeId: string;
}

export interface AttendanceModel extends Model<IAttendance>, IAttendance {}

// **** Models **** //

export const Attendance = sequelize.define<AttendanceModel>('attendance', {
  checkInTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checkOutTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shiftId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      async exist(value: string) {
        const shift = await Shift.findByPk(value);
        if (!shift) {
          throw new Error('Invalid ShiftId');
        }
      },
    },
    references: {
      model: Shift,
      key: 'id',
    },
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      async exist(value: string) {
        const employee = await Employee.findByPk(value);
        if (!employee) {
          throw new Error('Invalid EmployeeId');
        }
      },
    },
    references: {
      model: Employee,
      key: 'id',
    },
  },
});

// **** Relationship **** //

// Employee 1:m Attendance
Employee.hasMany(Attendance, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Attendance.belongsTo(Employee);

// Shift 1:m Attendance
Shift.hasMany(Attendance, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Attendance.belongsTo(Shift);

// **** Functions **** //

/**
 * Create new Attendance.
 */
function new_(checkInTime: string, shiftId: string, employeeId: string): IAttendance {
  return {
    checkInTime: checkInTime,
    shiftId: shiftId,
    employeeId: employeeId,
  };
}

/**
 * See if the param meets criteria to be a Attendance.
 */
function isAttendance(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'checkInTime' in arg &&
    'shiftId' in arg &&
    'employeeId' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  isAttendance,
} as const;
