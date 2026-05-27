import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  LOG_LEVEL: z.string().default('info'),
  CLOUDFLARE_ZONE_ID: z.string().default(''),
  CLOUDFLARE_API_TOKEN: z.string().default(''),
  CLOUDFLARE_PURGE_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  CLOUDFLARE_API_BASE_URL: z.string().default(''),
})

const env = schema.parse(process.env)

export const config = {
  nodeEnv: env.NODE_ENV,
  databaseUrl: env.DATABASE_URL,
  redisUrl: env.REDIS_URL,
  logLevel: env.LOG_LEVEL,
  cloudflare: {
    zoneId: env.CLOUDFLARE_ZONE_ID,
    apiToken: env.CLOUDFLARE_API_TOKEN,
    purgeEnabled: env.CLOUDFLARE_PURGE_ENABLED,
    apiBaseUrl: env.CLOUDFLARE_API_BASE_URL,
  },
}
