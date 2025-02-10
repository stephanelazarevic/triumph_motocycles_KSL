import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { MotorcycleController } from "../controllers/MotorcycleController.ts";
import { motorcycleRepository, dealerRepository, warrantyRepository } from "../config/repositoriesDependencies.ts";

const motorcycleRouter = new Router();

const motorcycleController = new MotorcycleController(motorcycleRepository, dealerRepository, warrantyRepository);

motorcycleRouter.get("/api/motorcycle", motorcycleController.getAll);

export default motorcycleRouter;
