import HttpStatusCodes from '../constants/HttpStatusCodes';
import { IStore, Store } from '../models/Store';
import { RouteError } from '../other/classes';
import storeRepo from '../repos/store.repo';

// **** Variables **** //

const STORE_REQUEST_ERROR = 'Request can not be handle';

// **** Class **** //

class StoreService {
  // **** Functions **** //

  /**
   * getById
   */
  public async getById(id: string) {
    try {
      const result = await storeRepo.getById(id);
      if (!result) throw new Error('Store not found.');

      return result;
    } catch (error) {
    console.log('🚀 ~ StoreService ~ getById ~ error:', error);


      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, STORE_REQUEST_ERROR);
    }
  }

  /**
   * Get all store.
   */
  public async getAll() {
    try {
      const result = await storeRepo.getAll();

      return result;
    } catch (error) {
    console.log('🚀 ~ StoreService ~ getAll ~ error:', error);


      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, STORE_REQUEST_ERROR);
    }
  }

  /**
   * Get list Stores.
   */
  public async getList(page: number, pageSize: number) {
    try {
      const stores = await storeRepo.getList(page, pageSize);
      const total = await Store.count();
      const totalPages = Math.ceil(total / pageSize);

      const result = { stores, total, totalPages };
      return result;
    } catch (error) {
      console.log('🚀 ~ StoreService ~ getList ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, STORE_REQUEST_ERROR);
    }
  }

  /**
   * createOne
   */
  public async createOne(store: IStore) {
    try {
      const result = await storeRepo.create(store);

      return result;
    } catch (error) {
      console.log('🚀 ~ StoreService ~ createOne ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, STORE_REQUEST_ERROR);
    }
  }

  /**
   * Update one Store
   */
  public async updateOne(id: string, name?: string, managerId?: string) {
    try {
      const result = await storeRepo.update(id, name, managerId);

      return result;
    } catch (error) {
      console.log('🚀 ~ StoreService ~ updateOne ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, STORE_REQUEST_ERROR);
    }
  }

  /**
   * Delete one Store
   */
  public async deleteOne(id: string) {
    try {
      const result = await storeRepo.delete(id);

      return result;
    } catch (error) {
      console.log('🚀 ~ StoreService ~ deleteOne ~ error:', error);

      if (error instanceof Error)
        throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
      else throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, STORE_REQUEST_ERROR);
    }
  }
}

export default new StoreService();
