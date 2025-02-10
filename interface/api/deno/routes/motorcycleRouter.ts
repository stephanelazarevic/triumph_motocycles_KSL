import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MotorcycleController } from "../controllers/MotorcycleController.ts";
import { motorcycleRepository, motorcycleHistoryRepository } from "../config/repositoriesDependencies.ts";

const motorcycleRouter = new Hono();

const motorcycleController = new MotorcycleController(motorcycleRepository, motorcycleHistoryRepository);

motorcycleRouter.get("/", () => motorcycleController.getAll());

export default motorcycleRouter;
