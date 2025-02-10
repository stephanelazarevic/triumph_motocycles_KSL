import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { partRepository, orderRepository } from "../config/repositoriesDependencies.ts";
import { OrderController } from "../controllers/OrderController.ts";
const orderRouter = new Hono();

const orderController = new OrderController(orderRepository, partRepository);

orderRouter.get("/", (context) => orderController.getAll(context));
orderRouter.get("/",       (context) => orderController.getAll(context));
orderRouter.get("/:id",    (context) => orderController.getById(context));
orderRouter.post("/",      (context) => orderController.create(context));
orderRouter.put("/:id",    (context) => orderController.update(context));
orderRouter.delete("/:id", (context) => orderController.delete(context));

export default orderRouter;
