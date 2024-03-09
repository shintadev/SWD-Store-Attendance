import { sequelize } from '@src/repos/sequelize.orm';
import { DataTypes, Model } from 'sequelize';
import { Employee } from './Employee';
import { Shift } from './Shift';

// **** Types **** //

export interface IEmployeeShift {
  employeeId: string;
  shiftId: string;
}

interface EmployeeShiftModel extends Model<IEmployeeShift>, IEmployeeShift {}

// **** Models **** //

export const EmployeeShift = sequelize.define<EmployeeShiftModel>(
  'employee_shift',
  {
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
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// **** Relationship **** //

// Employee n:m Shift (junction table: EmployeeShift)
Employee.belongsToMany(Shift, {
  through: EmployeeShift,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Shift.belongsToMany(Employee, {
  through: EmployeeShift,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
