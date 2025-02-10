import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { AuthenticationController } from "../controllers/AuthenticationController.ts";
import { userRepository } from "../config/repositoriesDependencies.ts";
import { passwordService, tokenGeneratorService } from "../config/servicesDependencies.ts";

import { handleRequest } from "../utils/handleRequest.ts";

const authenticationRouter = new Router();

const authenticationController = new AuthenticationController(userRepository, passwordService, tokenGeneratorService);

authenticationRouter.get("/api/signin", handleRequest(authenticationController.signIn.bind(authenticationController)));

export default authenticationRouter;
