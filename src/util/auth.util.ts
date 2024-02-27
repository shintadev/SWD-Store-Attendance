import userService from '@src/services/user.service';
import bcrypt from 'bcrypt';

// **** Variables **** //

const SALT_ROUNDS = 12;

// **** Functions **** //

/**
 * Verify input password.
 */
export async function verify(id: string, password: string) {
  const user = await userService.getById(id);
  const hashPassword = user.password;
  if (!(await compare(password, hashPassword))) {
    throw new Error('Verify failed');
  }
  return user;
}

/**
 * Get a hash from the password.
 */
export async function getHash(password: string): Promise<string> {
  const result = await bcrypt.hash(password, SALT_ROUNDS);
  return result;
}

/**
 * Useful for testing.
 */
export function hashSync(password: string) {
  const result = bcrypt.hashSync(password, SALT_ROUNDS);
  return result;
}

/**
 * See if a password passes the hash.
 */
export async function compare(password: string, hash: string): Promise<boolean> {
  const result = await bcrypt.compare(password, hash);
  return result;
}
