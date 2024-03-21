import { IUser, User } from '../models/User';
import { sequelize } from './sequelize.orm';

// **** Types **** //

interface updateParams {
  password?: string;
  role?: string;
}

// **** Class **** //

class UserRepo {
  // **** Functions **** //

  /**
   * Get list users.
   */
  public async getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const result = await User.findAll({
      offset: offset,
      limit: pageSize,
    }).then(function (users) {
      if (users) {
        const result: IUser[] = [];
        users.forEach((user) => {
          result.push(user.dataValues);
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
    const result = await User.findByPk(id).then(function (user) {
      if (user) {
        return user.dataValues;
      } else return null;
    });

    return result;
  }

  /**
   * Create new user.
   */
  public async create(user: IUser) {
    const transaction = await sequelize.transaction();
    try {
      const result = await User.create(user, { transaction: transaction });
      transaction.commit();

      return result.dataValues;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  /**
   * Update a user.
   */
  public async update(id: string, password?: string, role?: string) {
    const updateValues: updateParams = {};

    if (password) {
      updateValues.password = password;
    }

    if (role) {
      updateValues.role = role;
    }

    const transaction = await sequelize.transaction();
    try {
      if (Object.keys(updateValues).length > 0) {
        const result = await User.update(updateValues, {
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
   * Delete a user.
   */
  public async delete(id: string) {
    const transaction = await sequelize.transaction();
    try {
      const result = await User.destroy({
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

export default new UserRepo();
