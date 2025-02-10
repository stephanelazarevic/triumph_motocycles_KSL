import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { AuthenticationInvalidCredentialsError } from "../../../domain/errors/AuthenticationInvalidCredentialsError.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { SignInCommand } from "../../../domain/types/AuthenticationType.ts";
import { UserRepository } from '../../repositories/UserRepository.ts';
import { PasswordService } from "../../services/PasswordService.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { TokenGeneratorService } from "../../services/TokenGeneratorService.ts";

export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenGeneratorService: TokenGeneratorService,
  ) {}

  async execute(command: SignInCommand): Promise<UserEntity | Error> {
    const validEmailAddress = EmailAddress.from(command.emailAddress);
    if(validEmailAddress instanceof Error) {
      return validEmailAddress;
    }

    const user = await this.userRepository.findByEmail(validEmailAddress);

    if (user instanceof UserNotFoundError) {
      return new UserNotFoundError();
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      command.password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      return new AuthenticationInvalidCredentialsError();
    }

    const token = await this.tokenGeneratorService.generate(user);

    user.setToken(token);

    return user;
  }
}