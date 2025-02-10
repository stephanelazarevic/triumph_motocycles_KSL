import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { UserController } from "../controllers/UserController.ts";
import { userRepository } from "../config/repositoriesDependencies.ts";
import { passwordService } from "../config/servicesDependencies.ts";

const userRouter = new Hono();
const userController = new UserController(userRepository, passwordService);

userRouter.get("/",               (context) => userController.getAll(context));
userRouter.post("/",              (context) => userController.create(context));
userRouter.get("/:id",            (context) => userController.getById(context));
userRouter.delete("/:id",         (context) => userController.delete(context));
userRouter.patch("/:id/contact",  (context) => userController.updateContactInfo(context));
userRouter.patch("/:id/personal", (context) => userController.updatePersonalInfo(context));
userRouter.patch("/:id/password", (context) => userController.updatePassword(context));

export default userRouter