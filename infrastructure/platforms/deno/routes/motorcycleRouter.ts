import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { MotorcycleController } from "../controllers/MotorcycleController.ts";
import { motorcycleRepository } from "../config/dependencies.ts";
import { handleRequest } from "../utils/handleRequest.ts";

const motorcycleRouter = new Router();

const motorcycleController = new MotorcycleController(motorcycleRepository);

motorcycleRouter.get("/api/motorcycle", handleRequest(motorcycleController.getAll.bind(motorcycleController)));

export default motorcycleRouter;
