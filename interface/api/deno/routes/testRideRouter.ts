import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { clientRepository, motorcycleRepository, testRideRepository } from "../config/repositoriesDependencies.ts";
import { TestRideController } from "../controllers/TestRideController.ts";

const rentalRouter = new Hono();

const testRideController = new TestRideController(testRideRepository, clientRepository, motorcycleRepository);

rentalRouter.get("/",       (context) => testRideController.getAll(context));
rentalRouter.get("/:id",    (context) => testRideController.getById(context));
rentalRouter.post("/",      (context) => testRideController.create(context));
rentalRouter.put("/:id",    (context) => testRideController.update(context));
rentalRouter.delete("/:id", (context) => testRideController.delete(context));

export default rentalRouter;
