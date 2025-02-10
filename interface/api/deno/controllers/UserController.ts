import type { UserRepository } from "../../../../application/repositories/UserRepository.ts";
import { AddUserUsecase } from "../../../../application/usecases/user/AddUserUsecase.ts";
import { GetUserUsecase } from "../../../../application/usecases/user/GetUserUsecase.ts";
import { ListUsersUsecase } from "../../../../application/usecases/user/ListUsersUsecase.ts";
import { SoftDeleteUserUsecase } from "../../../../application/usecases/user/SoftDeleteUserUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import {
  createUserRequestSchema,
  updateUserContactInformationRequestSchema,
  updateUserPasswordRequestSchema,
  updateUserPersonalInformationRequestSchema,
} from "../schemas/userRequestSchema.ts";
import { UserEntity } from "../../../../domain/entities/UserEntity.ts";
import { PasswordService } from "../../../../domain/services/PasswordService.ts";
import { UpdateUserContactInformationUsecase } from "../../../../application/usecases/user/UpdateUserContactInformationUsecase.ts";
import { UpdateUserPersonalInformationUsecase } from "../../../../application/usecases/user/UpdateUserPersonalInformationUsecase.ts";
import { UpdateUserPasswordUsecase } from "../../../../application/usecases/user/UpdateUserPasswordUsecase.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class UserController implements EntityControllerInterface{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  public async getAllUsers(): Promise<Response> {
    const listUsersUsecase = new ListUsersUsecase(this.userRepository);

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

    const findUserUsecase = new GetUserUsecase(this.userRepository);

    const result = await findUserUsecase.execute(id);

    if (result instanceof UserEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      UserNotFoundError: () => new Response("User not found", { status: 404 }),
    });
  }

  public async createUser(request: Request): Promise<Response> {
    const addUserUsecase = new AddUserUsecase(this.userRepository, this.passwordService);

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
    } = validation.data;

    const error = await addUserUsecase.execute({
      firstname,
      lastname,
      emailAddress,
      plainPassword,
      phoneNumber,
      address,
    });

    if (error instanceof UserEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(error.name, {
      UserEmailAddressAlreadyUsedError: () => new Response("Email address already used", { status: 400 }),
      PhoneNumberInvalidError: () => new Response("Invalid phone number format", { status: 400 }),
      EmailAddressInvalidFormatError: () => new Response("Invalid email address format", { status: 400 }),
      AddressTooShortError: () => new Response("Address too short", { status: 400 }),
      AddressInvalidPostalCodeError: () => new Response("Invalid postal code", { status: 400 }),
      AddressInvalidCountryError: () => new Response("Invalid country code", { status: 400 }),
      PasswordError: () => new Response("Invalid password", { status: 400 }),
      default: () => new Response("An unexpected error occurred.", { status: 500 }),
    });
  }

  public async updateUserContactInfo(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateUserContactInformationRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateUserContactInformationUsecase = new UpdateUserContactInformationUsecase(this.userRepository);
    const result = await updateUserContactInformationUsecase.execute(userId, validation.data);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => new Response("User not found", { status: 404 }),
        PhoneNumberInvalidError: () => new Response("Invalid phone number", { status: 400 }),
        EmailAddressInvalidError: () => new Response("Invalid email address", { status: 400 }),
        default: () => new Response("An unexpected error occurred.", { status: 500 }),
      });
    }

    return new Response(null, { status: 200 });
  }

  public async updateUserPassword(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateUserPasswordRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateUserPasswordUsecase = new UpdateUserPasswordUsecase(this.userRepository, this.passwordService);
    const result = await updateUserPasswordUsecase.execute(userId, validation.data);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => new Response("User not found", { status: 404 }),
        InvalidCurrentPasswordError: () => new Response("Invalid current password", { status: 400 }),
        PasswordError: () => new Response("Invalid new password", { status: 400 }),
        default: () => new Response("An unexpected error occurred.", { status: 500 }),
      });
    }

    return new Response(null, { status: 200 });
  }

  public async updateUserPersonalInfo(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateUserPersonalInformationRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateUserPersonalInformationUsecase = new UpdateUserPersonalInformationUsecase(this.userRepository);
    const result = await updateUserPersonalInformationUsecase.execute(userId, validation.data);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => new Response("User not found", { status: 404 }),
        AddressInvalidError: () => new Response("Invalid address", { status: 400 }),
        default: () => new Response("An unexpected error occurred.", { status: 500 }),
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

    const softDeleteUserUsecase = new SoftDeleteUserUsecase(this.userRepository);

    const result = await softDeleteUserUsecase.execute(id);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => new Response("User Not Found Error", { status: 404 }),
      });
    }

    return new Response(null, { status: 204 });
  }
}
