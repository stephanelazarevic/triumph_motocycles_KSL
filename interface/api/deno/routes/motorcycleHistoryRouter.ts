import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MotorcycleHistoryController } from "../controllers/MotorcycleHistoryController.ts";
import { motorcycleHistoryRepository } from "../config/repositoriesDependencies.ts";
import { motorcycleHistoryService } from "../config/servicesDependencies.ts";
const motorcycleHistoryRouter = new Hono();

const motorcycleHistoryController = new MotorcycleHistoryController(motorcycleHistoryRepository, motorcycleHistoryService);

motorcycleHistoryRouter.get("/", (context) => motorcycleHistoryController.getAll(context));
motorcycleHistoryRouter.get("/",       (context) => motorcycleHistoryController.getAll(context));
motorcycleHistoryRouter.get("/:id",    (context) => motorcycleHistoryController.getById(context));
motorcycleHistoryRouter.post("/",      (context) => motorcycleHistoryController.create(context));
motorcycleHistoryRouter.put("/:id",    (context) => motorcycleHistoryController.update(context));
motorcycleHistoryRouter.delete("/:id", (context) => motorcycleHistoryController.delete(context));

export default motorcycleHistoryRouter;
