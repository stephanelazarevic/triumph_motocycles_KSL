import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MotorcyclePartController } from "../controllers/MotorcyclePartController.ts";
import { motorcyclePartRepository, motorcycleRepository, partRepository } from "../config/repositoriesDependencies.ts";
const motorcyclePartRouter = new Hono();

const motorcyclePartController = new MotorcyclePartController(motorcyclePartRepository, motorcycleRepository, partRepository);

motorcyclePartRouter.get("/", (context) => motorcyclePartController.getAll(context));
motorcyclePartRouter.get("/",       (context) => motorcyclePartController.getAll(context));
motorcyclePartRouter.get("/:id",    (context) => motorcyclePartController.getById(context));
motorcyclePartRouter.post("/",      (context) => motorcyclePartController.create(context));
motorcyclePartRouter.put("/:id",    (context) => motorcyclePartController.update(context));
motorcyclePartRouter.delete("/:id", (context) => motorcyclePartController.delete(context));

export default motorcyclePartRouter;
