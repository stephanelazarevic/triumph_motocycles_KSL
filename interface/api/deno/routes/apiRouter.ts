import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";

const apiRouter = new Hono();

apiRouter.get("/", (context: Context) => {
  return context.json('OK', 200);
});

export default apiRouter;
