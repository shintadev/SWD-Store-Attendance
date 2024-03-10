import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

export const generateKeyPair = () => {
  try {
    const publicKey = randomBytes(64).toString('hex');
    const privateKey = randomBytes(64).toString('hex');

    return {
      publicKey,
      privateKey,
    };
  } catch (error) {
    throw new Error('Cannot generate key pair');
  }
};

export const createJWTTokenPair = (payload: object, publicKey: string, privateKey: string) => {
  try {
    const accessToken = sign(payload, publicKey, {
      expiresIn: '1 days',
      algorithm: 'HS256',
    });

    const refreshToken = sign(payload, privateKey, {
      expiresIn: '4 days',
      algorithm: 'HS256',
    });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new Error('Cannot generate JWT token pair');
  }
};

export const generateAccessToken = (payload: object, publicKey: string) => {
  try {
    const accessToken = sign(payload, publicKey, {
      expiresIn: '1 days',
    });

    return accessToken;
  } catch (error) {
    throw new Error('Cannot refresh token');
  }
};
