import { z } from 'zod';
import { appSchema } from './app.schema.js';

export const envSchema = z.object({
  ...appSchema.shape,
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  return envSchema.parse(config);
}
