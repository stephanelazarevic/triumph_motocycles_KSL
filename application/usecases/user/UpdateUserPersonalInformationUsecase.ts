import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { Address } from "../../../domain/value-objects/Address.ts";
import { Name } from "../../../domain/value-objects/Name.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { NameType } from "../../../domain/enum/NameEnum.ts";
import type { UpdateUserPersonalInformationCommand } from "../../../domain/types/UserType.ts";

export class UpdateUserPersonalInformationUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(userId: string, command: UpdateUserPersonalInformationCommand): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOneById(userId);
    if (user instanceof UserNotFoundError) {
      return user;
    }

    if (command.firstname !== undefined) {
      const validFirstname = this.validateFirstname(command.firstname);
      if (validFirstname instanceof Error) {
        return validFirstname;
      }
      user.firstname = validFirstname;
      user.markAsUpdated();
    }

    if (command.lastname !== undefined) {
      const validLastname = this.validateLastname(command.lastname);
      if (validLastname instanceof Error) {
        return validLastname;
      }
      user.lastname = validLastname;
      user.markAsUpdated();
    }

    if (command.address) {
      const currentAddress = user.address;
      const validAddress = this.validateAddress({
        street: command.address.street ?? currentAddress.street,
        postalCode: command.address.postalCode ?? currentAddress.postalCode,
        countryCode: command.address.countryCode ?? currentAddress.countryCode,
      });
      if (validAddress instanceof Error) {
        return validAddress;
      }
      user.address = validAddress;
      user.markAsUpdated();
    }

    await this.userRepository.save(user);
    return user;
  }

  private validateFirstname(firstname: string): Name | Error {
    return Name.from(firstname, NameType.FIRSTNAME);
  }

  private validateLastname(lastname: string): Name | Error {
    return Name.from(lastname, NameType.LASTNAME);
  }

  private validateAddress(address: {
    street: string;
    postalCode: string;
    countryCode: string;
  }): Address | Error {
    return Address.from(
      address.street,
      address.postalCode,
      address.countryCode,
    );
  }
}
