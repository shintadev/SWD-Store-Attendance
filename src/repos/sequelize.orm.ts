import EnvVars from '../constants/EnvVars';
import { Options, Sequelize } from 'sequelize';
import pg from 'pg';

// **** Variables **** //

const DB_USER = EnvVars.DB.PostGre.USER;
const DB_PASSWORD = EnvVars.DB.PostGre.PASSWORD;
const DB_HOST = EnvVars.DB.PostGre.HOST;
const DB_NAME = EnvVars.DB.PostGre.DATABASE;

// **** Connection **** //

const uri = 'postgres://' + DB_USER + ':' + DB_PASSWORD + '@' + DB_HOST + '/' + DB_NAME;

const config: Options = {
  dialect: 'postgres',
  dialectModule: pg,
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

// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

sequelize.sync();

// async function alterTable() {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log('Table created');
//   } catch (error) {
//     console.log('🚀 ~ createAndUseTable ~ error:', error);
//   }
// }

// alterTable();

// async function clearTable() {
//   try {
//     await sequelize.sync({ force: true }).then(() => {
//       console.log('All tables truncated successfully.');
//     });
//   } catch (error) {
//     console.log('🚀 ~ createAndUseTable ~ error:', error);
//   }
// }

// clearTable();
