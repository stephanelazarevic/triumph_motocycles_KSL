import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const apiRouter = new Router();

apiRouter.get("/api", (context) => {
  context.response.body = { status: "OK" };
});


export default apiRouter;
