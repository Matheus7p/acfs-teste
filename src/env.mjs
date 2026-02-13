import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPABASE_URL: z.string(),
    VITE_SUPABASE_KEY: z.string(),
    VITE_API_URL: z.string(),
  },
  runtimeEnv: {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY,
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
