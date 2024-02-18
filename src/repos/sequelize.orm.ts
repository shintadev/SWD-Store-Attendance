import EnvVars from '@src/constants/EnvVars';
import { IAttendance } from '@src/models/Attendance';
import { IEmployee } from '@src/models/Employee';
import { IShift } from '@src/models/Shift';
import { DataTypes, Model, Sequelize } from 'sequelize';

// **** Variables **** //

const DB_USER = EnvVars.DB.PostGre.USER;
const DB_PASSWORD = EnvVars.DB.PostGre.PASSWORD;
const DB_HOST = EnvVars.DB.PostGre.HOST;
const DB_NAME = EnvVars.DB.PostGre.DATABASE;

// **** Types **** //

export interface EmployeeModel extends Model<IEmployee>, IEmployee {}
export interface ShiftModel extends Model<IShift>, IShift {}
export interface AttendanceModel extends Model<IAttendance>, IAttendance {}

// **** Connection **** //

const uri = 'postgres://' + DB_USER + ':' + DB_PASSWORD + '@' + DB_HOST + '/' + DB_NAME;

const config = {
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  sync: {
    alter: true,
  },
};

const sequelize = new Sequelize(uri, config);

// **** Models **** //

const Employee = sequelize.define<EmployeeModel>(
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
    },
  },
  {
    // tableName: 'employee',
    freezeTableName: true,
    // paranoid: true,
  }
);

const Shift = sequelize.define<ShiftModel>('shift', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Attendance = sequelize.define<AttendanceModel>('attendance', {
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  shiftId: {
    type: DataTypes.STRING,
    references: {
      model: Shift,
      key: 'id',
    },
    allowNull: false,
  },
  employeeId: {
    type: DataTypes.STRING,
    references: {
      model: Employee,
      key: 'id',
    },
    allowNull: false,
  },
});

const EmployeeShift = sequelize.define(
  'employee_shift',
  {
    employeeId: {
      type: DataTypes.STRING,
      references: {
        model: Employee,
        key: 'id',
      },
      allowNull: false,
    },
    shiftId: {
      type: DataTypes.STRING,
      references: {
        model: Shift,
        key: 'id',
      },
      allowNull: false,
    },
  },
  { timestamps: false }
);

// **** Relationship **** //

// Employee 1:m Attendance
Employee.hasMany(Attendance, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Attendance.belongsTo(Employee, {});

// Shift 1:m Attendance
Shift.hasMany(Attendance, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Attendance.belongsTo(Shift, {});

// Employee n:m Shift (junction table: EmployeeShift)
Employee.belongsToMany(Shift, {
  through: EmployeeShift,
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Shift.belongsToMany(Employee, {
  through: EmployeeShift,
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// async function alterTable() {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log('Table created');
//   } catch (error) {
//     console.log('🚀 ~ createAndUseTable ~ error:', error);
//   }
// }

// alterTable();

// **** Export default **** //

export default {
  Employee,
  Shift,
  Attendance,
} as const;
