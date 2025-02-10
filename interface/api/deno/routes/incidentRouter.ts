import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { IncidentController } from "../controllers/IncidentController.ts";
import { incidentRepository, motorcycleRepository } from "../config/repositoriesDependencies.ts";
const incidentRouter = new Hono();

const incidentController = new IncidentController(incidentRepository, motorcycleRepository);

incidentRouter.get("/", (context) => incidentController.getAll(context));
incidentRouter.get("/",       (context) => incidentController.getAll(context));
incidentRouter.get("/:id",    (context) => incidentController.getById(context));
incidentRouter.post("/",      (context) => incidentController.create(context));
incidentRouter.put("/:id",    (context) => incidentController.update(context));
incidentRouter.delete("/:id", (context) => incidentController.delete(context));
incidentRouter.delete("/motorcycle/period/:id", (context) => incidentController.getIncidentByMotorcycleIdAndPeriod(context));

export default incidentRouter;
