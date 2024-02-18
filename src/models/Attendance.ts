// **** Variables **** //

// **** Types **** //

export interface IAttendance {
  checkInTime: Date;
  checkOutTime?: Date;
  shiftId: string;
  employeeId: string;
}

// **** Functions **** //

/**
 * Create new Attendance.
 */
function new_(checkInTime: Date, shiftId: string, employeeId: string): IAttendance {
  return {
    checkInTime: checkInTime,
    shiftId: shiftId,
    employeeId: employeeId,
  };
}

/**
 * See if the param meets criteria to be a Attendance.
 */
function isAttendance(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'checkInTime' in arg &&
    'shiftId' in arg &&
    'employeeId' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  isAttendance,
} as const;
