import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { DriverController } from "../controllers/DriverController.ts";
import { driverRepository, motorcycleRepository } from "../config/repositoriesDependencies.ts";
const driverRouter = new Hono();

const driverController = new DriverController(driverRepository, motorcycleRepository);

driverRouter.get("/", (context) => driverController.getAll(context));
driverRouter.get("/",       (context) => driverController.getAll(context));
driverRouter.get("/:id",    (context) => driverController.getById(context));
driverRouter.post("/",      (context) => driverController.create(context));
driverRouter.put("/:id",    (context) => driverController.update(context));
driverRouter.delete("/:id", (context) => driverController.delete(context));

export default driverRouter;
