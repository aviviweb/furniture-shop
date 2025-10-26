export interface ServerEnv {
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  NEXT_PUBLIC_BASE_URL: string;
  DEMO_MODE: 'true' | 'false' | string;
  OPENAI_API_KEY?: string;
  SENDGRID_API_KEY?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  STRIPE_SECRET_KEY?: string;
  GOOGLE_MAPS_API_KEY?: string;
  GOOGLE_APPLICATION_CREDENTIALS?: string;
  CLOUDINARY_URL?: string;
}

export function getServerEnv(): ServerEnv {
  const env = (key: string, fallback?: string) => process.env[key] ?? fallback ?? '';
  return {
    DATABASE_URL: env('DATABASE_URL'),
    REDIS_URL: env('REDIS_URL', 'redis://localhost:6379'),
    JWT_SECRET: env('JWT_SECRET', 'change-me'),
    NEXT_PUBLIC_BASE_URL: env('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
    DEMO_MODE: env('DEMO_MODE', 'true'),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  };
}


