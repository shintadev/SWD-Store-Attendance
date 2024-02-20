import EnvVars from '@src/constants/EnvVars';
import { Sequelize } from 'sequelize';

// **** Variables **** //

const DB_USER = EnvVars.DB.PostGre.USER;
const DB_PASSWORD = EnvVars.DB.PostGre.PASSWORD;
const DB_HOST = EnvVars.DB.PostGre.HOST;
const DB_NAME = EnvVars.DB.PostGre.DATABASE;

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

export const sequelize = new Sequelize(uri, config);

// async function alterTable() {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log('Table created');
//   } catch (error) {
//     console.log('🚀 ~ createAndUseTable ~ error:', error);
//   }
// }

// alterTable();
