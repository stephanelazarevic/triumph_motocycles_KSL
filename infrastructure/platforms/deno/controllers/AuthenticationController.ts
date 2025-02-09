import { exhaustive } from "npm:exhaustive";
import { signInRequestSchema } from '../schemas/authentificationRequestSchema.ts'
import { SignInUseCase } from "../../../../application/usecases/authentification/SignInUsecase.ts";
import { UserRepository } from '../../../../application/repositories/UserRepository.ts'
import { PasswordService } from '../../../../application/services/PasswordService.ts'
import { TokenGeneratorService } from '../../../../application/services/TokenGeneratorService.ts'

export class AuthenticationController {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenGenerator: TokenGeneratorService,
  ) {}

  async signIn(request: Request) {
    const body = await request.json();

    const signinUsecase = new SignInUseCase(
      this.userRepository,
      this.passwordService,
      this.tokenGenerator
    );

    const validation = signInRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response('Malformed request', {
        status: 400,
      });
    }

    const result = await signinUsecase.execute(validation.data);

    console.warn('LOGIN RESULT', result);
    if ('token' in result) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return exhaustive(result.name, {
      UserNotFoundError: () => new Response('User not found', { status: 404 }),
      InvalidCredentialsError: () => new Response('Invalid credentials', { status: 401 }),
    });
  }
}