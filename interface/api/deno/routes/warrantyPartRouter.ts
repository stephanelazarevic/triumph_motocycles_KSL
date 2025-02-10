import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { WarrantyPartController } from "../controllers/WarrantyPartController.ts";
import { warrantyPartRepository, partRepository, warrantyRepository } from "../config/repositoriesDependencies.ts";

const warrantyPartRouter = new Hono();

const warrantyPartController = new WarrantyPartController(warrantyPartRepository, warrantyRepository, partRepository);

warrantyPartRouter.get("/",       (context) => warrantyPartController.getAll(context));
warrantyPartRouter.get("/:id",    (context) => warrantyPartController.getById(context));
warrantyPartRouter.post("/",      (context) => warrantyPartController.create(context));
warrantyPartRouter.put("/:id",    (context) => warrantyPartController.update(context));
warrantyPartRouter.delete("/:id", (context) => warrantyPartController.delete(context));

export default warrantyPartRouter;
