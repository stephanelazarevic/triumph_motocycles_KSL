import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { clientRepository, motorcycleRepository, rentalRepository } from "../config/repositoriesDependencies.ts";
import { RentalController } from "../controllers/RentalController.ts";
const rentalRouter = new Hono();

const rentalController = new RentalController(rentalRepository, clientRepository, motorcycleRepository);

rentalRouter.get("/", (context) => rentalController.getAll(context));
rentalRouter.get("/",       (context) => rentalController.getAll(context));
rentalRouter.get("/:id",    (context) => rentalController.getById(context));
rentalRouter.post("/",      (context) => rentalController.create(context));
rentalRouter.put("/:id",    (context) => rentalController.update(context));
rentalRouter.delete("/:id", (context) => rentalController.delete(context));

export default rentalRouter;
