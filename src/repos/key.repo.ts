import { IKey, Key } from '@src/models/Key';
import { sequelize } from './sequelize.orm';

// **** Class **** //

class KeyRepo {
  // **** Functions **** //

  /**
   * getById
   */
  public async getById(id: string) {
    const result = await Key.findByPk(id).then(function (key) {
      if (key) {
        return key;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * create
   */
  public async create(key: IKey) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Key.create(key, { transaction: transaction });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * update
   */
  public async update(key: IKey) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Key.update(
        key, 
        {
          where:{
            id:key.id,
          }, 
          transaction: transaction,
        },
      );
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}

// **** Export default **** //

export default new KeyRepo();
