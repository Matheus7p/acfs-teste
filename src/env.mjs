import { createEnv } from "@t3-oss/t3-env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPABASE_URL: z.string(),
    VITE_SUPABASE_KEY: z.string(),
  },
  runtimeEnv: import.meta.env,
});
