/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: process.env.COOKIE_SECRET ?? '',
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? '',
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? '',
      secure: process.env.SECURE_COOKIE === 'true',
    },
  },
  Jwt: {
    Secret: process.env.JWT_SECRET ?? '',
    Exp: process.env.COOKIE_EXP ?? '', // exp at the same time as the cookie
  },
  DB: {
    PostGre: {
      HOST: process.env.PGHOST ?? '',
      DATABASE: process.env.PGDATABASE ?? '',
      USER: process.env.PGUSER ?? '',
      PASSWORD: process.env.PGPASSWORD ?? '',
      ENDPOINT_ID: process.env.PGENDPOINT_ID ?? '',
    },
  },
  Rekognition: {
    REGION: process.env.AWS_REGION ?? '',
    ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID ?? '',
    SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    COLLECTION_ID: process.env.AWS_COLLECTION_ID ?? '',
  },
  Cloudinary: {
    NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET ?? '',
  },
} as const;







