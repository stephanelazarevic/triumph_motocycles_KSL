import { User } from "../../../domain/entities/User.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { PasswordService } from "../../../domain/services/PasswordService.ts";
import { Password } from "../../../domain/value-objects/Password.ts";
import { UserEmailAddressAlreadyUsedError } from "../../../domain/errors/UserEmailAddressAlreadyUsedError.ts";
import { Address } from "../../../domain/value-objects/Address.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { Name } from "../../../domain/value-objects/Name.ts";
import { NameType } from "../../../domain/enum/NameEnum.ts";
import { AddUserCommand } from "../../../domain/types/UserType.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";

export class AddUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  public async execute(command: AddUserCommand): Promise<User | Error> {
    const validFirstname = Name.from(command.firstname, NameType.FIRSTNAME);
    if (validFirstname instanceof Error) {
      return validFirstname;
    }

    const validLastname = Name.from(command.lastname, NameType.LASTNAME);
    if (validLastname instanceof Error) {
      return validLastname;
    }

    const validPhoneNumber = PhoneNumber.from(command.phoneNumber);
    if (validPhoneNumber instanceof Error) {
      return validPhoneNumber;
    }

    const validEmailAddress = EmailAddress.from(command.emailAddress);
    if (validEmailAddress instanceof Error) {
      return validEmailAddress;
    }

    const validAddress = Address.from(
      command.address.street,
      command.address.postalCode,
      command.address.countryCode,
    );
    if (validAddress instanceof Error) {
      return validAddress;
    }

    const validPasssword = Password.from(command.plainPassword);
    if (validPasssword instanceof Error) {
      return validPasssword;
    }

    const existingUser = await this.userRepository.findByEmail(command.emailAddress);
    if (existingUser) {
      return new UserEmailAddressAlreadyUsedError();
    }

    const hashedPassword = await this.passwordService.hashPassword(validPasssword);

    const user = User.create({
      firstname: validFirstname,
      lastname: validLastname,
      emailAddress: validEmailAddress,
      hashedPassword,
      phoneNumber: validPhoneNumber,
      address: validAddress,
    });

    if (user instanceof Error) {
      return user;
    }

    await this.userRepository.save(user);

    return user;
  }
}
