import { IStore, Store } from '../models/Store';
import { sequelize } from './sequelize.orm';

// **** Types **** //

interface updateParams {
  name?: string;
  managerId?: string;
}

// **** Class **** //

class StoreRepo {
  // **** Functions **** //

  /**
   * Get list stores.
   */
  public async getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const result = await Store.findAll({
      offset: offset,
      limit: pageSize,
    }).then(function (stores) {
      if (stores) {
        const result: IStore[] = [];
        stores.forEach((store) => {
          result.push(store.dataValues);
        });
        return result;
      } else return null;
    });

    return result;
  }

  /**
   * getById
   */
  public async getById(id: string) {
    const result = await Store.findByPk(id).then(function (store) {
      if (store) {
        return store;
      } else return null;
    });
    return result;
  }

  /**
   * Get all store.
   */
  public async getAll() {
    const result = await Store.findAll().then(function (stores) {
      if (stores) {
        const result: IStore[] = [];
        stores.forEach((store) => {
          result.push(store.dataValues);
        });
        return result;
      } else return null;
    });

    return result;
  }

  /**
   * create
   */
  public async create(store: IStore) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Store.create(store, { transaction: transaction });
      transaction.commit();

      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update.
   */
  public async update(id: string, name?: string, managerId?: string) {
    const updateValues: updateParams = {};

    if (name) {
      updateValues.name = name;
    }

    if (managerId) {
      updateValues.managerId = managerId;
    }

    const transaction = await sequelize.transaction();
    try {
      if (Object.keys(updateValues).length > 0) {
        const result = await Store.update(updateValues, {
          where: {
            id: id,
          },
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
   * delete
   */
  public async delete(id: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await Store.destroy({
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

export default new StoreRepo();
