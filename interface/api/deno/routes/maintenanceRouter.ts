import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MaintenanceController } from "../controllers/MaintenanceController.ts";
import { maintenanceRepository } from "../config/repositoriesDependencies.ts";
const maintenanceRouter = new Hono();

const maintenanceController = new MaintenanceController(maintenanceRepository);

maintenanceRouter.get("/", (context) => maintenanceController.getAll(context));
maintenanceRouter.get("/",       (context) => maintenanceController.getAll(context));
maintenanceRouter.get("/:id",    (context) => maintenanceController.getById(context));
maintenanceRouter.post("/",      (context) => maintenanceController.create(context));
maintenanceRouter.put("/:id",    (context) => maintenanceController.update(context));
maintenanceRouter.delete("/:id", (context) => maintenanceController.delete(context));

export default maintenanceRouter;
