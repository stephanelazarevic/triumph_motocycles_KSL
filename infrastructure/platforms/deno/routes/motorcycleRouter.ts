import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { MotorcycleController } from "../controllers/MotorcycleController.ts";
import { motorcycleRepository, dealerRepository, warrantyRepository } from "../config/repositoriesDependencies.ts";
import { handleRequest } from "../utils/handleRequest.ts";

const motorcycleRouter = new Router();

const motorcycleController = new MotorcycleController(motorcycleRepository, dealerRepository, warrantyRepository);

motorcycleRouter.get("/api/motorcycle", handleRequest(motorcycleController.getAll.bind(motorcycleController)));

export default motorcycleRouter;
