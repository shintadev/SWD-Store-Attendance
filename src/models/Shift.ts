import { sequelize } from '../repos/sequelize.orm';
import moment from 'moment';
import { DataTypes, Model } from 'sequelize';
import { Store } from './Store';

// **** Types **** //

export interface IShift {
  id: string;
  shiftNo: number;
  day: Date;
  storeId: string;
}

interface ShiftModel extends Model<IShift>, IShift {}

// **** Models **** //

export const Shift = sequelize.define<ShiftModel>('shift', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  shiftNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      valid(value: number) {
        if (value < 0 || value > 4) {
          throw new Error('Invalid shiftNo');
        }
      },
    },
  },
  day: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  storeId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Store,
      key: 'id',
    },
  },
});

// **** Relationship **** //

// Store 1:m Shift
Store.hasMany(Shift, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Shift.belongsTo(Store);

// **** Functions **** //

/**
 * Create new Shift.
 */
function new_(shiftNo: number, day: Date, storeId: string): IShift {
  const seed = new Date(day).toISOString();
  const date = moment(seed);
  let month = (date.month() + 1).toString();
  if (date.month() + 1 < 10) month = '0' + (date.month() + 1).toString();
  const id = date.date().toString() + month + date.year() + '_' + shiftNo + '_' + storeId;
  return {
    id: id,
    shiftNo: shiftNo,
    day: day,
    storeId: storeId,
  };
}

/**
 * See if the param meets criteria to be a Shift.
 */
function isShift(arg: unknown): boolean {
  return !!arg && typeof arg === 'object' && 'id' in arg && 'shiftNo' in arg && 'day' in arg;
}

// **** Export default **** //

export default {
  new: new_,
  isShift,
} as const;
