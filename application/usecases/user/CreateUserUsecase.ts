import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { PasswordService } from "../../../domain/services/PasswordService.ts";
import { Password } from "../../../domain/types/Password.ts";
import { UserEmailAddressAlreadyUsedError } from "../../../domain/errors/UserEmailAddressAlreadyUsedError.ts";

export class CreateUserUsecase {
  private static passwordService: PasswordService;

  constructor(private readonly userRepository: UserRepository) {}

  public async execute(
    firstname: string,
    lastname: string,
    emailAddress: string,
    plainPassword: string,
    phoneNumber: string,
    street: string,
    postalCode: string,
    countryCode: string,
    isAdministrator: boolean
  ): Promise<UserEntity | Error> {
    const existingUser = await this.userRepository.findByEmail(emailAddress);
    if (existingUser) {
      return new UserEmailAddressAlreadyUsedError();
    }

    const validPasssword = Password.from(plainPassword);
    if (validPasssword instanceof Error) {
      return validPasssword;
    }

    const hashedPassword = await CreateUserUsecase.passwordService.hashPassword(
      validPasssword
    );

    const userEntity = UserEntity.create(
      firstname,
      lastname,
      emailAddress,
      hashedPassword,
      phoneNumber,
      street,
      postalCode,
      countryCode,
      isAdministrator
    );

    if (userEntity instanceof Error) {
      return userEntity;
    }

    await this.userRepository.save(userEntity);

    return userEntity;
  }
}
