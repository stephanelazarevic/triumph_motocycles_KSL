import { MotorcycleRepositoryInMemory } from "../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { MotorcycleController } from "./controllers/MotorcycleController.ts";

const options = {
  port: 8000,
  host: "0.0.0.0",
};

const motorcycleRepository = new MotorcycleRepositoryInMemory([]);

const motorcycleController = new MotorcycleController(motorcycleRepository);

const handler = (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);

    if (url.pathname === "/motorcycles") {
      if (request.method === "GET") {
        return motorcycleController.listMotorcycles(request);
      }

      if (request.method === "POST") {
        return motorcycleController.createMotorcycle(request);
      }
    }

    return Promise.resolve(
      new Response("Not found", {
        status: 404,
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return Promise.resolve(
      new Response(message, {
        status: 500,
      }),
    );
  }
};

Deno.serve(options, handler);
