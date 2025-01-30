import { AddUserUsecase } from "../../../../../application/usecases/user/AddUserUsecase.ts";
import { UserEntity } from "../../../../../domain/entities/UserEntity.ts";
import { AddressInvalidCountryError } from "../../../../../domain/errors/AddressInvalidCountryError.ts";
import { AddressInvalidPostalCodeError } from "../../../../../domain/errors/AddressInvalidPostalCodeError.ts";
import { AddressTooShortError } from "../../../../../domain/errors/AddressTooShortError.ts";
import { EmailAddressInvalidFormatError } from "../../../../../domain/errors/EmailAddressInvalidFormatError.ts";
import { PasswordTooShortError } from "../../../../../domain/errors/PasswordTooShortError.ts";
import { PhoneNumberInvalidError } from "../../../../../domain/errors/PhoneNumberInvalidError.ts";
import { UserRepositoryInMemory } from "../../../../adapters/repositories/UserRepositoryInMemory.ts";
import { BCryptPasswordService } from "../../../../services/BCryptPasswordService.ts";

const userRepository = new UserRepositoryInMemory([]);
const passwordService = new BCryptPasswordService();

Deno.test("Should create and persist a user successfully", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "John",
    lastname: "Doe",
    emailAddress: "john.doe@example.com",
    plainPassword: "SecurePass123!",
    phoneNumber: "+1234567890",
    address: {
      street: "123 Main St",
      postalCode: "12345",
      countryCode: "US",
    },
  });

  if (result instanceof Error) {
    throw new Error("Test failed: Unexpected error.");
  }

  console.assert(result.firstname.getValue() === "John", "Firstname should be John.");
  console.assert(result.lastname.getValue() === "DOE", "Lastname should be DOE.");
});

Deno.test("Should fail when the password is too short", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "John",
    lastname: "Doe",
    emailAddress: "john.doe@example.com",
    plainPassword: "Short1!",
    phoneNumber: "+1234567890",
    address: {
      street: "123 Main St",
      postalCode: "12345",
      countryCode: "US",
    },
  });

  if (!(result instanceof PasswordTooShortError)) {
    throw new Error("Test failed: Expected PasswordTooShortError.");
  }
});

Deno.test("Should fail when the phone number is invalid", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "John",
    lastname: "Doe",
    emailAddress: "john.doe@example.com",
    plainPassword: "SecurePass123!",
    phoneNumber: "INVALID_PHONE",
    address: {
      street: "123 Main St",
      postalCode: "12345",
      countryCode: "US",
    },
  });

  if (!(result instanceof PhoneNumberInvalidError)) {
    throw new Error("Test failed: Expected PhoneNumberInvalidError.");
  }
});

Deno.test("Should fail when the email address is invalid", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "John",
    lastname: "Doe",
    emailAddress: "invalid-email",
    plainPassword: "SecurePass123",
    phoneNumber: "+1234567890",
    address: {
      street: "123 Main St",
      postalCode: "12345",
      countryCode: "US",
    },
  });

  if (!(result instanceof EmailAddressInvalidFormatError)) {
    throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
  }
});

Deno.test("Should fail when the address is invalid", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "John",
    lastname: "Doe",
    emailAddress: "john.doe@example.com",
    plainPassword: "SecurePass123",
    phoneNumber: "+1234567890",
    address: {
      street: "St",
      postalCode: "123",
      countryCode: "INVALID_COUNTRY",
    },
  });

  if (result instanceof AddressTooShortError) {
    return;
  }

  if (result instanceof AddressInvalidPostalCodeError) {
    return;
  }

  if (result instanceof AddressInvalidCountryError) {
    return;
  }

  throw new Error("Test failed: Expected an Address-related error.");
});

Deno.test("Should fail when required fields are empty", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "",
    lastname: "",
    emailAddress: "",
    plainPassword: "",
    phoneNumber: "",
    address: {
      street: "",
      postalCode: "",
      countryCode: "",
    },
  });

  if (!(result instanceof Error)) {
    throw new Error(
      "Test failed: Expected an error for missing required fields.",
    );
  }
});

Deno.test("Should persist the created user", async () => {
  const usecase = new AddUserUsecase(userRepository, passwordService);

  const result = await usecase.execute({
    firstname: "John",
    lastname: "Doe",
    emailAddress: "john.doe@example.com",
    plainPassword: "SecurePass123",
    phoneNumber: "+1234567890",
    address: {
      street: "123 Main St",
      postalCode: "12345",
      countryCode: "US",
    },
  });

  if (result instanceof Error) {
    throw new Error("Test failed: Unexpected error.");
  }

  const persistedUser = await userRepository.findOneById(result.id);

  if (persistedUser instanceof UserEntity) {
    console.assert(
      String(persistedUser.emailAddress) === "john.doe@example.com",
      "Email should match.",
    );
  } else {
    throw new Error("Test failed: User not found.");
  }
});
