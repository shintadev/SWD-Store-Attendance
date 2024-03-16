import { IShift, Shift } from '../models/Shift';
import { WhereOptions } from 'sequelize';
import { sequelize } from './sequelize.orm';

// **** Types **** //

interface updateParams {
  shiftNo?: number;
  day?: Date;
}

// **** Class **** //

class ShiftRepo {
  // **** Functions **** //

  /**
   * Get one shift.
   */
  public async getById(id: string) {
    const result = await Shift.findOne({
      where: {
        id: id,
      },
    }).then(function (shift) {
      if (shift) {
        return shift.dataValues;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * Get shift list.
   */
  public async getShifts(condition: WhereOptions) {
    const result = await Shift.findAll({
      where: condition,
    }).then(function (shifts) {
      if (shifts) {
        const output: IShift[] = [];
        shifts.forEach((shift) => {
          output.push(shift.dataValues);
        });
        return output;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * See if a shift with the given id exists.
   */
  public async persists(id: string): Promise<boolean> {
    const shift = await Shift.findOne({
      where: { id: id },
    });
    if (shift) return true;
    else return false;
  }

  /**
   * Create new shift.
   */
  public async create(shift: IShift) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Shift.create(shift, { transaction: transaction });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update a shift.
   */
  public async update(id: string, shiftNo?: number, day?: Date) {
    const updateValues: updateParams = {};

    if (shiftNo) {
      updateValues.shiftNo = shiftNo;
    }

    if (day) {
      updateValues.day = day;
    }

    const transaction = await sequelize.transaction();
    try {
      // Only execute the update if there are values to update
      if (Object.keys(updateValues).length > 0) {
        const result = await Shift.update(updateValues, {
          where: {
            id: id,
          }, // Use shorthand for where clause
          transaction: transaction,
        });
        transaction.commit();

        return result;
      }
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete one shift.
   */
  public async delete(id: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Shift.destroy({
        where: {
          id: id,
        },
        transaction: transaction,
      });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}

// **** Export default **** //

export default new ShiftRepo();
