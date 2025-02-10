import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { partRepository, orderRepository, dealerRepository } from "../config/repositoriesDependencies.ts";
import { PartController } from "../controllers/PartController.ts";
const partRouter = new Hono();

const partController = new PartController(partRepository, dealerRepository, orderRepository);

partRouter.get("/", (context) => partController.getAll(context));
partRouter.get("/",       (context) => partController.getAll(context));
partRouter.get("/:id",    (context) => partController.getById(context));
partRouter.post("/",      (context) => partController.create(context));
partRouter.put("/:id",    (context) => partController.update(context));
partRouter.delete("/:id", (context) => partController.delete(context));

export default partRouter;
