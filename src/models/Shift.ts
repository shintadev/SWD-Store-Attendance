import { generateId } from '@src/util/misc';

// **** Variables **** //

// **** Types **** //

export interface IShift {
  id: string;
  startTime: Date;
  endTime: Date;
}

// **** Functions **** //

/**
 * Create new Shift.
 */
function new_(startTime: Date, endTime: Date): IShift {
  return {
    id: generateId(startTime),
    startTime: startTime,
    endTime: endTime,
  };
}

/**
 * See if the param meets criteria to be a Shift.
 */
function isShift(arg: unknown): boolean {
  return !!arg && typeof arg === 'object' && 'id' in arg && 'startTime' in arg && 'endTime' in arg;
}

// **** Export default **** //

export default {
  new: new_,
  isShift,
} as const;
