import { IUser, User } from '@src/models/User';
import { sequelize } from './sequelize.orm';

// **** Class **** //

class UserRepo {
  // **** Functions **** //

  /**
   * getById
   */
  public async getById(id: string) {
    const result = await User.findByPk(id).then(function (user) {
      if (user) {
        return user;
      } else throw new Error('Error while getting record');
    });
    return result;
  }

  /**
   * create
   */
  public async create(user: IUser) {
    const transaction = await sequelize.transaction();
    try {
      const result = await User.create(user, { transaction: transaction });
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
