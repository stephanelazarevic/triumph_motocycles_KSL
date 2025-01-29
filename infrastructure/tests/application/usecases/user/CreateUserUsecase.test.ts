import { CreateUserUsecase } from "../../../../../application/usecases/user/AddUserUsecase.ts";
import { UserEntity } from "../../../../../domain/entities/UserEntity.ts";
import { AddressInvalidCountryError } from "../../../../../domain/errors/AddressInvalidCountryError.ts";
import { AddressInvalidPostalCodeError } from "../../../../../domain/errors/AddressInvalidPostalCodeError.ts";
import { AddressTooShortError } from "../../../../../domain/errors/AddressTooShortError.ts";
import { EmailAddressInvalidFormatError } from "../../../../../domain/errors/EmailAddressInvalidFormatError.ts";
import { PasswordTooShortError } from "../../../../../domain/errors/PasswordTooShortError.ts";
import { PhoneNumberInvalidError } from "../../../../../domain/errors/PhoneNumberInvalidError.ts";
import { UserRepositoryInMemory } from "../../../../adapters/repositories/UserRepositoryInMemory.ts";

const userRepository = new UserRepositoryInMemory([]);

Deno.test("Should create and persist a user successfully", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "john.doe@example.com",
    "SecurePass123!",
    "+1234567890",
    "123 Main St",
    "12345",
    "US",
    false,
  );

  if (result instanceof Error) {
    throw new Error("Test failed: Unexpected error.");
  }

  console.assert(result.firstname === "John", "Firstname should be John.");
  console.assert(result.lastname === "DOE", "Lastname should be DOE.");
});

Deno.test("Should fail when the password is too short", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "john.doe@example.com",
    "Short1!",
    "+1234567890",
    "123 Main St",
    "12345",
    "US",
    false,
  );

  if (!(result instanceof PasswordTooShortError)) {
    throw new Error("Test failed: Expected PasswordTooShortError.");
  }
});

Deno.test("Should fail when the phone number is invalid", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "john.doe@example.com",
    "SecurePass123!",
    "INVALID_PHONE",
    "123 Main St",
    "12345",
    "US",
    false,
  );

  if (!(result instanceof PhoneNumberInvalidError)) {
    throw new Error("Test failed: Expected PhoneNumberInvalidError.");
  }
});

Deno.test("Should fail when the email address is invalid", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "invalid-email",
    "SecurePass123!",
    "+1234567890",
    "123 Main St",
    "12345",
    "US",
    false,
  );

  if (!(result instanceof EmailAddressInvalidFormatError)) {
    throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
  }
});

Deno.test("Should fail when the address is invalid", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "john.doe@example.com",
    "SecurePass123!",
    "+1234567890",
    "St",
    "123",
    "INVALID_COUNTRY",
    false,
  );

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
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute("", "", "", "", "", "", "", "", false);

  if (!(result instanceof Error)) {
    throw new Error(
      "Test failed: Expected an error for missing required fields.",
    );
  }
});

Deno.test("Should persist the created user", async () => {
  const usecase = new CreateUserUsecase(userRepository);

  const result = await usecase.execute(
    "John",
    "Doe",
    "john.doe@example.com",
    "SecurePass123!",
    "+1234567890",
    "123 Main St",
    "12345",
    "US",
    false,
  );

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
