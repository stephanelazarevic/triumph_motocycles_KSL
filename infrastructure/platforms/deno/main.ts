import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import motorcycleRouter from "./routes/motorcycleRouter.ts";
import apiRouter from "./routes/apiRouter.ts";
import { prisma } from "./config/prisma.db.ts";
import authenticationRouter from "./routes/authenticationRouter.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const handler = async (request: Request): Promise<Response> => {
  // Préparation de la réponse
  const response = new Response("Hello from Deno!", {
    headers: new Headers({
      "Access-Control-Allow-Origin": "http://localhost:8080", // URL du frontend
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    }),
  });

  // Gérer les requêtes OPTIONS (pré-requêtes)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
};

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

await serve(handler, { port: 8000 });
