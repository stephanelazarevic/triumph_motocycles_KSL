import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import motorcycleRouter from "./routes/motorcycleRouter.ts";
import apiRouter from "./routes/apiRouter.ts";
import { prisma } from "./config/prisma.db.ts";
import authenticationRouter from "./routes/authenticationRouter.ts";

const app = new Application();

// test db connection
try {
  await prisma.$connect();
  console.log('✅ Successfully connected to database');
} catch (error) {
  console.error('❌ Database connection error:', error);
  Deno.exit(1);
} finally {
  await prisma.$disconnect();
}

// routes
app
  .use(apiRouter.routes())
  .use(authenticationRouter.routes())
  .use(motorcycleRouter.routes());

// allowedMethods
app
  .use(apiRouter.allowedMethods())
  .use(authenticationRouter.allowedMethods())
  .use(motorcycleRouter.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Server running on : ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

await app.listen({ port: 8000 });
