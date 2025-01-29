import { User } from "../../../domain/entities/User.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import type { UpdateUserContactInformationCommand } from "../../../domain/types/UserType.ts";

export class UpdateUserContactInformationUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(userId: string, command: UpdateUserContactInformationCommand): Promise<User | Error> {
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
      user.markAsUpdated();
    }

    if (command.phoneNumber !== undefined) {
      const validPhoneNumber = PhoneNumber.from(command.phoneNumber);
      if (validPhoneNumber instanceof Error) {
        return validPhoneNumber;
      }
      user.phoneNumber = validPhoneNumber;
      user.markAsUpdated();
    }

    await this.userRepository.save(user);
    return user;
  }

  private async findUser(userId: string): Promise<User | Error> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return new UserNotFoundError();
    }
    return user;
  }
}
