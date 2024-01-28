import * as e from 'express';
import { Query } from 'express-serve-static-core';

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  cookies: any;
  body: T;
}

export interface IReqAny extends e.Request {
  cookies: any;
  body: any;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  cookies: any;
  query: T;
  body: U;
}

export interface IRes extends e.Response {
  locals: {
    // sessionUser: ISessionUser;
  };
}

