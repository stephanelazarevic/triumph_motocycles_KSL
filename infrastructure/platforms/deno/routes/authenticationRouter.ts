import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { AuthenticationController } from "../controllers/AuthenticationController.ts";
import { userRepository } from "../config/repositoriesDependencies.ts";
import { passwordService, tokenGeneratorService } from "../config/servicesDependencies.ts";

const authenticationRouter = new Hono();

const authenticationController = new AuthenticationController(userRepository, passwordService, tokenGeneratorService);

authenticationRouter.post("/login", (context) => authenticationController.signIn(context))

export default authenticationRouter;
