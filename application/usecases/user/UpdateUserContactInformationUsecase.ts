import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import type { UpdateUserContactInformationCommand } from "../../../domain/types/UserType.ts";

export class UpdateUserContactInformationUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(userId: string, command: UpdateUserContactInformationCommand): Promise<UserEntity | Error> {
    const user = await this.findUser(userId);
    if (user instanceof Error) {
      return user;
    }

    if (command.emailAddress !== undefined) {
      const validEmailAddress = EmailAddress.from(command.emailAddress);
      if (validEmailAddress instanceof Error) {
        return validEmailAddress;
      }
      user.emailAddress = validEmailAddress;
    }

    if (command.phoneNumber !== undefined) {
      const validPhoneNumber = PhoneNumber.from(command.phoneNumber);
      if (validPhoneNumber instanceof Error) {
        return validPhoneNumber;
      }
      user.phoneNumber = validPhoneNumber;
    }

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
}
