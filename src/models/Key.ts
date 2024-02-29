import { sequelize } from '@src/repos/sequelize.orm';
import { DataTypes, Model } from 'sequelize';
import { User } from './User';

// **** Types **** //

export interface IKey {
  id: string;
  publicKey: string;
  privateKey: string;
  accessToken: string;
  refreshToken: string;
}

export interface KeyModel extends Model<IKey>, IKey {}

// **** Models **** //

export const Key = sequelize.define<KeyModel>('Key', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      async exist(value: string) {
        const user = await User.findByPk(value);
        if (!user) {
          throw new Error('Invalid EmployeeId');
        }
      },
    },
    references: {
      model: User,
      key: 'id',
    },
  },
  publicKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  privateKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// **** Relationship **** //

// User 1:1 Key
User.hasOne(Key, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Key.belongsTo(User, {
  foreignKey: 'id',
});

// **** Functions **** //

/**
 * Create new Attendance.
 */
function new_(
  id: string,
  publicKey: string,
  privateKey: string,
  accessToken: string,
  refreshToken: string
): IKey {
  return {
    id: id,
    publicKey: publicKey,
    privateKey: privateKey,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

// **** Export default **** //

export default {
  new: new_,
} as const;
