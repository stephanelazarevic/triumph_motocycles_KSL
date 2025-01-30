import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { UserPasswordsDoNotMatchError } from "../../../domain/errors/UserPasswordsDoNotMatchError.ts";
import { UserSamePasswordError } from "../../../domain/errors/UserSamePasswordError.ts";
import { PasswordService } from "../../../domain/services/PasswordService.ts";
import { UpdateUserPasswordCommand } from "../../../domain/types/UserType.ts";
import { Password } from "../../../domain/value-objects/Password.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";

export class UpdateUserPasswordUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  public async execute(userId: string, command: UpdateUserPasswordCommand): Promise<UserEntity | Error> {
    const user = await this.findUser(userId);
    if (user instanceof Error) {
      return user;
    }

    const passwordsMatchError = this.validatePasswordsMatch(
      command.newPassword,
      command.confirmNewPassword,
    );
    if (passwordsMatchError instanceof Error) {
      return passwordsMatchError;
    }

    const validPassword = this.validatePasswordFormat(command.newPassword);
    if (validPassword instanceof Error) {
      return validPassword;
    }

    const isSamePasswordError = await this.validatePasswordIsDifferent(
      command.newPassword,
      user.hashedPassword,
    );
    if (isSamePasswordError instanceof Error) {
      return isSamePasswordError;
    }

    const hashedPassword = await this.passwordService.hashPassword(validPassword);

    user.hashedPassword = hashedPassword;
    user.markAsUpdated();

    await this.userRepository.save(user);
    return user;
  }

  private async findUser(userId: string): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return new UserNotFoundError();
    }
    return user;
  }

  private validatePasswordsMatch(password: string, confirmPassword: string): void | Error {
    if (password !== confirmPassword) {
      return new UserPasswordsDoNotMatchError();
    }
  }

  private validatePasswordFormat(password: string): Password | Error {
    return Password.from(password);
  }

  private async validatePasswordIsDifferent(
    newPassword: string,
    currentHashedPassword: string,
  ): Promise<void | Error> {
    const isSamePassword = await this.passwordService.comparePassword(
      newPassword,
      currentHashedPassword,
    );
    if (isSamePassword) {
      return new UserSamePasswordError();
    }
  }
}
