import type { UserRepository } from "../../../../application/repositories/UserRepository.ts";
import { CreateUserUsecase } from "../../../../application/usecases/user/CreateUserUsecase.ts";
import { FindUserUsecase } from "../../../../application/usecases/user/GetUserUsecase.ts";
import { FindAllUsersUsecase } from "../../../../application/usecases/user/ListUsersUsecase.ts";
import { UpdateUserUsecase } from "../../../../application/usecases/user/UpdateUserUsecase.ts";
import { DeleteUserUsecase } from "../../../../application/usecases/user/DeleteUserUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createUserRequestSchema } from "../schemas/createUserRequestSchema.ts";
import { updateUserRequestSchema } from "../schemas/updateUserRequestSchema.ts";
import { UserEntity } from "../../../../domain/entities/UserEntity.ts";

export class UserController {
  public constructor(private readonly userRepository: UserRepository) {}

  public async getAllUsers(): Promise<Response> {
    const listUsersUsecase = new FindAllUsersUsecase(this.userRepository);

    const result = await listUsersUsecase.execute();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getUserById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("User ID is required", { status: 400 });
    }

    const findUserUsecase = new FindUserUsecase(this.userRepository);

    const result = await findUserUsecase.execute(id);

    if (result instanceof UserEntity) {
      return new Response(JSON.stringify(result), { status: 200, headers: {
        "Content-Type": "application/json",
      }, });
    }

    return exhaustive(result.name, {
      UserNotFoundError:  () => new Response("User not found", { status: 404 }),
    });
  }

  public async createUser(request: Request): Promise<Response> {
    const createUserUsecase = new CreateUserUsecase(this.userRepository);

    const body = await request.json();

    const validation = createUserRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const {
      firstname,
      lastname,
      emailAddress,
      plainPassword,
      phoneNumber,
      address,
      isAdministrator
    } = validation.data;

    const error = await createUserUsecase.execute(firstname, lastname, emailAddress, plainPassword, phoneNumber, address, isAdministrator);

    if (error instanceof UserEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(error.name, {
      UserEmailAddressAlreadyUsedError: () => new Response("Email address already used",    { status: 400 }),
      PhoneNumberInvalidError:          () => new Response("Invalid phone number format",   { status: 400 }),
      EmailAddressInvalidFormatError:   () => new Response("Invalid email address format",  { status: 400 }),
      AddressTooShortError:             () => new Response("Address too short",             { status: 400 }),
      AddressInvalidPostalCodeError:    () => new Response("Invalid postal code",           { status: 400 }),
      AddressInvalidCountryError:       () => new Response("Invalid country code",          { status: 400 }),
      PasswordError:                    () => new Response("Invalid password",              { status: 400 }),
      UserEntityError:                  () => new Response("Failed to create user",         { status: 500 }),
      default:                          () => new Response("An unexpected error occurred.", { status: 500 })
    });
  }

  public async updateUser(request: Request, userId: string): Promise<Response> {
    const body = await request.json();
    const validation = updateUserRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify(validation.error.errors),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { ...userData } = validation.data;
    const updateUserUsecase = new UpdateUserUsecase(this.userRepository);
    const result = await updateUserUsecase.execute(userId, userData);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError:        () => new Response("User not found",                { status: 404 }),
        PhoneNumberInvalidError:  () => new Response("Invalid phone number",          { status: 400 }),
        EmailAddressInvalidError: () => new Response("Invalid email address",         { status: 400 }),
        AddressInvalidError:      () => new Response("Invalid address",               { status: 400 }),
        default:                  () => new Response("An unexpected error occurred.", { status: 500 })
      });
    }

    return new Response(null, { status: 200 });
  }

  public async deleteUser(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("User ID is required", { status: 400 });
    }

    const deleteUserUsecase = new DeleteUserUsecase(this.userRepository);

    const result = await deleteUserUsecase.execute(id);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => new Response("User Not Found Error", { status: 404 }),
      });
    }

    return new Response(null, { status: 204 });
  }
}
