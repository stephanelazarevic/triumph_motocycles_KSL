import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { WarrantyController } from "../controllers/WarrantyController.ts";
import { motorcycleRepository, warrantyRepository } from "../config/repositoriesDependencies.ts";
const warrantyRouter = new Hono();

const warrantyController = new WarrantyController(warrantyRepository, motorcycleRepository);

warrantyRouter.get("/", (context) => warrantyController.getAll(context));
warrantyRouter.get("/",       (context) => warrantyController.getAll(context));
warrantyRouter.get("/:id",    (context) => warrantyController.getById(context));
warrantyRouter.post("/",      (context) => warrantyController.create(context));
warrantyRouter.put("/:id",    (context) => warrantyController.update(context));
warrantyRouter.delete("/:id", (context) => warrantyController.delete(context));

export default warrantyRouter;
