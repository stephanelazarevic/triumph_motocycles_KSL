import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MotorcycleController } from "../controllers/MotorcycleController.ts";
import { motorcycleRepository, motorcycleHistoryRepository } from "../config/repositoriesDependencies.ts";

const motorcycleRouter = new Hono();

const motorcycleController = new MotorcycleController(motorcycleRepository, motorcycleHistoryRepository);

motorcycleRouter.get("/",       (context) => motorcycleController.getAll(context));
motorcycleRouter.get("/:id",    (context) => motorcycleController.getById(context));
motorcycleRouter.post("/",      (context) => motorcycleController.create(context));
motorcycleRouter.put("/:id",    (context) => motorcycleController.update(context));
motorcycleRouter.delete("/:id", (context) => motorcycleController.delete(context));

export default motorcycleRouter;