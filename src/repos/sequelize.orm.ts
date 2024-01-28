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
// const config = {

// }
const sequelize = new Sequelize(
  'postgres://' + DB_USER + ':' + DB_PASSWORD + '@' + DB_HOST + '/' + DB_NAME,
  {
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    // sync: {
    //   force: true,
    //   alter: true,
    // },
  }
);
// console.log('🚀 ~ sequelize:', sequelize);

// **** Models **** //

const Employee = sequelize.define<EmployeeModel>(
  'employee',
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      get: function () {
        return this.getDataValue('id');
      },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      get: function () {
        return this.getDataValue('name');
      },
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      get: function () {
        return this.getDataValue('status');
      },
    },
    publicId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      get: function () {
        return this.getDataValue('publicId');
      },
    },
    rekognitionId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      get: function () {
        return this.getDataValue('rekognitionId');
      },
    },
  },
  {
    // tableName: 'employee',
    freezeTableName: true,
  }
);

async function alterTable() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Table created');
  } catch (error) {
    console.log('🚀 ~ createAndUseTable ~ error:', error);
  }
}

alterTable();

// **** Export default **** //

export default {
  Employee,
} as const;
