import EnvVars from '@src/constants/EnvVars';
import { IEmployee } from '@src/models/Employee';
import { DataTypes, Model, Sequelize } from 'sequelize';

// **** Variables **** //

const DB_USER = EnvVars.DB.PostGre.USER;
const DB_PASSWORD = EnvVars.DB.PostGre.PASSWORD;
const DB_HOST = EnvVars.DB.PostGre.HOST;
const DB_NAME = EnvVars.DB.PostGre.DATABASE;

// **** Types **** //

export interface EmployeeModel extends Model<IEmployee>, IEmployee {}

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
} as const;
