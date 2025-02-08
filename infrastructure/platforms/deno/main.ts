import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import motorcycleRouter from "./routes/motorcycleRouter.ts";
import apiRouter from "./routes/apiRouter.ts";

const app = new Application();

// routes
app.use(apiRouter.routes());
app.use(motorcycleRouter.routes());

// allowedMethods
app.use(apiRouter.allowedMethods());
app.use(motorcycleRouter.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Server running on : ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

await app.listen({ port: 8000 });
