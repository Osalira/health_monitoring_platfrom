/**
 * Environment variable validation.
 *
 * Called at app startup to fail loudly on bad config.
 * Missing required vars throw descriptive errors.
 */

interface EnvConfig {
  DATABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string | undefined;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string | undefined;
  NODE_ENV: string;
}

let _validated = false;

export function validateEnv(): EnvConfig {
  if (_validated) {
    return getEnv();
  }

  const missing: string[] = [];

  if (!process.env.DATABASE_URL) {
    missing.push('DATABASE_URL');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Check your .env.local file or hosting platform configuration.',
    );
  }

  // Warn about optional but recommended vars
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('[env] NEXT_PUBLIC_SUPABASE_URL not set — auth will be disabled');
  }

  _validated = true;
  return getEnv();
}

function getEnv(): EnvConfig {
  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  };
}
