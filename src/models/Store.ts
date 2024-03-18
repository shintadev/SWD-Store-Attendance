import { sequelize } from '../repos/sequelize.orm';
import { DataTypes, Model } from 'sequelize';
import { Employee } from './Employee';
import { nanoid } from 'nanoid';
import { User } from './User';

// **** Types **** //

export interface IStore {
  id: string;
  name: string;
  managerId: string;
}

interface StoreModel extends Model<IStore>, IStore {}

// **** Models **** //

export const Store = sequelize.define<StoreModel>('store', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  managerId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      async valid(value: string) {
        const user = await User.findByPk(value);
        if (!user) {
          throw new Error('Invalid ManagerId');
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

// Store 1:1 Employee
Store.hasOne(Employee, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Employee.belongsTo(Store, {
  foreignKey: 'id',
  targetKey: 'managerId',
});

// **** Functions **** //

/**
 * Create new Store.
 */
function new_(name: string, managerId: string): IStore {
  return {
    id: nanoid(5),
    name: name,
    managerId: managerId,
  };
}

/**
 * See if the param meets criteria to be a Store.
 */
function isStore(arg: unknown): boolean {
  return !!arg && typeof arg === 'object' && 'id' in arg && 'name' in arg && 'managerId' in arg;
}

// **** Export default **** //

export default {
  new: new_,
  isStore,
} as const;
