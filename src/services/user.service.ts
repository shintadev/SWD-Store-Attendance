import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IUser, User } from '@src/models/User';
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
   * Get list users.
   */
  public async getList(page: number, pageSize: number) {
    try {
      const users = await userRepo.getList(page, pageSize);
      const total = await User.count();
      const totalPages = Math.ceil(total / pageSize);

      const result = { users, total, totalPages };
      return result;
    } catch (error) {
      console.log('🚀 ~ userService ~ getOne ~ error:', error);

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

  /**
   * Update one user
   */
  public async updateOne(id: string, password?: string, role?: string) {
    try {
      const result = await userRepo.update(id, password, role);

      return result;
    } catch (error) {
      console.log('🚀 ~ UserService ~ updateOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, USER_REQUEST_ERROR);
    }
  }

  /**
   * Delete one user
   */
  public async deleteOne(id: string) {
    try {
      const result = await userRepo.delete(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ UserService ~ deleteOne ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, USER_REQUEST_ERROR);
    }
  }

  /**
   * getTotalUsers
   */
  public getTotalUsers() {
    try {
      const result = User.count();

      return result;
    } catch (error) {
      console.log('🚀 ~ UserService ~ getTotalUsers ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, USER_REQUEST_ERROR);
    }
  }
}

export default new UserService();
