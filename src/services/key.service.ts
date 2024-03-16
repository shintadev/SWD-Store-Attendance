import HttpStatusCodes from '../constants/HttpStatusCodes';
import { IKey } from '../models/Key';
import { RouteError } from '../other/classes';
import keyRepo from '../repos/key.repo';

// **** Variables **** //

const KEY_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

class KeyService {
  // **** Functions **** //

  /**
   * getByUserId
   */
  public async getByUserId(id: string) {
    try {
      const result = await keyRepo.getById(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ KeyService ~ getByUserId ~ error:', error);
    }
  }

  /**
   * createKeyToken
   */
  public async createKeyToken(keyObject: IKey) {
    try {
      const result = await keyRepo.create(keyObject);

      return result;
    } catch (error) {
      console.log('🚀 ~ KeyService ~ createKeyToken ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, KEY_REQUEST_ERROR);
    }
  }

  /**
   * updateKeyToken
   */
  public async updateKeyToken(keyObject: IKey) {
    try {
      const result = await keyRepo.update(keyObject);

      return result;
    } catch (error) {
      console.log('🚀 ~ KeyService ~ updateKeyToken ~ error:', error);

      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, KEY_REQUEST_ERROR);
    }
  }
}

export default new KeyService();
