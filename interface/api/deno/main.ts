import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import apiRouter from "./routes/apiRouter.ts";
import { prisma } from "./config/prisma.db.ts";
import authenticationRouter from "./routes/authenticationRouter.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

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

app.use(oakCors({
  origin: "http://localhost:8080",
  credentials: true,
}));

// routes
app
  .use(apiRouter.routes())
  .use(authenticationRouter.routes());
  // .use(motorcycleRouter.routes());

// allowedMethods
app
  .use(apiRouter.allowedMethods())
  .use(authenticationRouter.allowedMethods());
  // .use(motorcycleRouter.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Server running on : ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

await app.listen({ port: 8000 });
