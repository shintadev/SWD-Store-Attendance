import { IShift } from '@src/models/Shift';
import SequelizeORM from './sequelize.orm';
import { WhereOptions } from 'sequelize';

// **** Variables **** //

const orm = SequelizeORM;

// **** Types **** //

interface updateParams {
  startTime?: Date;
  endTime?: Date;
}

class ShiftRepo {
  // **** Functions **** //

  /**
   * Get one shift.
   */
  public async getById(id: string) {
    const result = await orm.Shift.findOne({
      where: {
        id: id,
      },
    }).then(function (shift) {
      if (shift) {
        return shift;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * Get shift list.
   */
  public async getShifts(condition: WhereOptions) {
    const result = await orm.Shift.findAll({
      where: condition,
    }).then(function (shift) {
      if (shift) {
        return shift;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * See if a shift with the given id exists.
   */
  public async persists(id: string): Promise<boolean> {
    const shift = await orm.Shift.findAll({
      where: { id: id },
    });
    if (shift) return true;
    else return false;
  }

  /**
   * Create new shift.
   */
  public async create(shift: IShift) {
    const result = await orm.Shift.create(shift).then(function (shift) {
      return shift;
    });
    return result;
  }

  /**
   * Update a shift.
   */
  public async update(id: string, start?: Date, end?: Date): Promise<void> {
    const updateValues: updateParams = {};

    if (start) {
      updateValues.startTime = start;
    }

    if (end) {
      updateValues.endTime = end;
    }

    // Only execute the update if there are values to update
    if (Object.keys(updateValues).length > 0) {
      await orm.Shift.update(updateValues, {
        where: {
          id: id,
        }, // Use shorthand for where clause
      });
    }
  }

  /**
   * Delete one shift.
   */
  public async delete(id: string): Promise<void> {
    await orm.Shift.destroy({
      where: {
        id: id,
      },
    });
  }
}

// **** Export default **** //

export default new ShiftRepo();
