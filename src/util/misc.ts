/**
 * Miscellaneous shared functions go here.
 */

import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { nanoid } from 'nanoid';

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

/**
 * Generate new random Id
 */
export function generateId(seed: string) {
  let result;

  if (moment(seed).isValid()) {
    const date = moment(seed);
    let month = (date.month() + 1).toString();
    if (date.month() + 1 < 10) month = '0' + (date.month() + 1).toString();
    result = date.date().toString() + month + date.year() + nanoid(4);
  } else {
    const name = seed.split(' ');
    let id = name[name.length - 1];
    for (let i = 0; i < name.length - 1; i++) {
      id = id + name[i].charAt(0);
    }
    result = id + nanoid(10 - id.length);
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    fn(req, res, next).catch(next);
  };
};
