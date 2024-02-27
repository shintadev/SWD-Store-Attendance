import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IUser } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import userRepo from '@src/repos/user.repo';
import { getHash } from '@src/util/auth.util';

// **** Variables **** //

const USER_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

class UserService {
  // **** Functions **** //

  /**
   * getById
   */
  public async getById(id: string) {
    try {
      const result = await userRepo.getById(id);

      return result.dataValues;
    } catch (error) {
      console.log('🚀 ~ UserService ~ getById ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, USER_REQUEST_ERROR);
    }
  }

  /**
   * createOne
   */
  public async createOne(user: IUser) {
    try {
      user.password = await getHash(user.password);

      const result = await userRepo.create(user);

      return result.dataValues;
    } catch (error) {
      console.log('🚀 ~ UserService ~ createOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, USER_REQUEST_ERROR);
    }
  }
}

export default new UserService();
