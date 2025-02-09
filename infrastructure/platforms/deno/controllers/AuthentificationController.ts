import { exhaustive } from "npm:exhaustive";
import { signInRequestSchema } from '../schemas/authentificationRequestSchema.ts'
import { SignInUseCase } from "../../../../application/usecases/authentification/SignInUsecase.ts";

export class AuthController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async signIn(request: Request) {
    const body = await request.json();

    const validation = signInRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response('Malformed request', {
        status: 400,
      });
    }

    const result = await this.signInUseCase.execute(validation.data);

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