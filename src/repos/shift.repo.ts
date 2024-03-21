import { IShift, Shift } from '../models/Shift';
import { WhereOptions } from 'sequelize';
import { sequelize } from './sequelize.orm';

// **** Types **** //

interface updateParams {
  shiftNo?: number;
  day?: string;
}

// **** Class **** //

class ShiftRepo {
  // **** Functions **** //

  /**
   * Get one shift.
   */
  public async getById(id: string) {
    const result = await Shift.findByPk(id).then(function (shift) {
      if (shift) {
        return shift.dataValues;
      } else return null;
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
      const output: IShift[] = [];
      if (shifts) {
        shifts.forEach((shift) => {
          output.push(shift.dataValues);
        });
      }
      return output;
    });

    return result;
  }

  /**
   * Create new shift.
   */
  public async create(shift: IShift) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Shift.create(shift, { transaction: transaction });
      transaction.commit();

      return result.dataValues;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update a shift.
   */
  public async update(shift: IShift) {
    const transaction = await sequelize.transaction();
    try {
      const oldRecord = await Shift.findOne({
        where: {
          id: shift.id,
        },
      }).then(function (shift) {
        if (shift) {
          return shift.dataValues;
        } else throw Error('Shift not found');
      });

      const updateValues: updateParams = {};

      if (shift.shiftNo !== oldRecord.shiftNo) {
        updateValues.shiftNo = shift.shiftNo;
      } else if (shift.day !== oldRecord.day) {
        updateValues.day = shift.day;
      } else return null;

      const result = await Shift.update(updateValues, {
        where: {
          id: shift.id,
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
