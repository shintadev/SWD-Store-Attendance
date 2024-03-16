import { sequelize } from '../repos/sequelize.orm';
import moment from 'moment';
import { DataTypes, Model } from 'sequelize';

// **** Types **** //

export interface IShift {
  id: string;
  shiftNo: number;
  day: Date;
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
});

// **** Functions **** //

/**
 * Create new Shift.
 */
function new_(shiftNo: number, day: Date): IShift {
  const seed = new Date(day).toISOString();
  const date = moment(seed);
  let month = (date.month() + 1).toString();
  if (date.month() + 1 < 10) month = '0' + (date.month() + 1).toString();
  const id = date.date().toString() + month + date.year() + '_' + shiftNo;
  return {
    id: id,
    shiftNo: shiftNo,
    day: day,
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
