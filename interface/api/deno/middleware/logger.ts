import { Context, Next } from "https://deno.land/x/hono@v3.11.4/mod.ts";

export const logger = async (c: Context, next: Next) => {
  const start = Date.now();
  const { method, url } = c.req;

  console.log(`➡️  ${method} ${url}`);

  try {
    await next();
  } catch (err) {
    console.error(`❌ ${method} ${url} - Error:`, err);
    throw err;
  }

  const ms = Date.now() - start;
  const status = c.res.status;

  let statusColor = "\x1b[32m";
  if (status >= 400) statusColor = "\x1b[31m";
  else if (status >= 300) statusColor = "\x1b[33m";

  console.log(
    `⬅️  ${method} ${url} - ${statusColor}${status}\x1b[0m - ${ms}ms`
  );
};