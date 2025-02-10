import { exhaustive } from "npm:exhaustive";
import { signInRequestSchema } from '../schemas/authentificationRequestSchema.ts'
import { SignInUseCase } from "../../../../application/usecases/authentification/SignInUsecase.ts";
import { UserRepository } from '../../../../application/repositories/UserRepository.ts'
import { PasswordService } from '../../../../application/services/PasswordService.ts'
import { TokenGeneratorService } from '../../../../application/services/TokenGeneratorService.ts'
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";

export class AuthenticationController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenGeneratorService: TokenGeneratorService
  ) {}

  async signIn(context: Context) {
   const body = await context.req.json();

    const validation = signInRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const signInUseCase = new SignInUseCase(
      this.userRepository,
      this.passwordService,
      this.tokenGeneratorService
    );

    const result = await signInUseCase.execute(validation.data);

    if ('token' in result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive(result.name, {
      UserNotFoundError: ()         => context.json({ message: "User not found" },       404),
      InvalidCredentialsError: ()   => context.json({ message: "Invalid credentials" },  401),
    });
  }
}