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
import { PasswordService } from "../../../../application/services/PasswordService.ts";
import { UpdateUserContactInformationUsecase } from "../../../../application/usecases/user/UpdateUserContactInformationUsecase.ts";
import { UpdateUserPersonalInformationUsecase } from "../../../../application/usecases/user/UpdateUserPersonalInformationUsecase.ts";
import { UpdateUserPasswordUsecase } from "../../../../application/usecases/user/UpdateUserPasswordUsecase.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";

export class UserController implements EntityControllerInterface{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listUsersUsecase = new ListUsersUsecase(this.userRepository);
    const result = await listUsersUsecase.execute();

    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "User ID is required" }, 400);
    }

    const findUserUsecase = new GetUserUsecase(this.userRepository);

    const result = await findUserUsecase.execute(id);

    if (result instanceof UserEntity) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive(result.name, {
      UserNotFoundError: () => context.json({ message: "User not found" }, 404)
    });
  }

  public async create(context: Context): Promise<Response> {
    const addUserUsecase = new AddUserUsecase(this.userRepository, this.passwordService);
    const body = await context.req.json();

    const validation = createUserRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const result = await addUserUsecase.execute(body);

    if (result instanceof UserEntity) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive(result.name, {
      UserEmailAddressAlreadyUsedError: () =>     context.json({ message: "Email address already used" }, 400),
      PhoneNumberInvalidError: () =>              context.json({ message: "Invalid phone number format" }, 400),
      EmailAddressInvalidFormatError: () =>       context.json({ message: "Invalid email address format" }, 400),
      AddressTooShortError: () =>                 context.json({ message: "Address too short" }, 400),
      AddressInvalidPostalCodeError: () =>        context.json({ message: "Invalid postal code" }, 400),
      AddressInvalidCountryError: () =>           context.json({ message: "Invalid country code" }, 400),
      PasswordError: () =>                        context.json({ message: "Invalid password" }, 400),
      default: () =>                              context.json({ message: "An unexpected error occurred" }, 500)
    });
  }

  public async updateContactInfo(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "User ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateUserContactInformationRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateUserContactInformationUsecase = new UpdateUserContactInformationUsecase(this.userRepository);
    const result = await updateUserContactInformationUsecase.execute(id, validation.data);
    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => context.json({ message: "User not found" }, 404),
        PhoneNumberInvalidError: () => context.json({ message: "Invalid phone number" }, 400),
        EmailAddressInvalidError: () => context.json({ message: "Invalid email address" }, 400),
        default: () => context.json({ message: "An unexpected error occurred" }, 500)
      });
    }

    return context.json(200);
  }

  public async updatePassword(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "User ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateUserPasswordRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateUserPasswordUsecase = new UpdateUserPasswordUsecase(this.userRepository, this.passwordService);
    const result = await updateUserPasswordUsecase.execute(id, validation.data);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => context.json({ message: "User not found" }, 404),
        InvalidCurrentPasswordError: () => context.json({ message: "Invalid current password" }, 400),
        PasswordError: () => context.json({ message: "Invalid new password" }, 400),
        default: () => context.json({ message: "An unexpected error occurred" }, 500)
      });
    }

    return context.json(200);
  }

  public async updatePersonalInfo(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "User ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateUserPersonalInformationRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateUserPersonalInformationUsecase = new UpdateUserPersonalInformationUsecase(this.userRepository);
    const result = await updateUserPersonalInformationUsecase.execute(id, validation.data);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => context.json({ message: "User not found" }, 404),
        AddressInvalidError: () => context.json({ message: "Invalid address" }, 400),
        default: () => context.json({ message: "An unexpected error occurred" }, 500)
      });
    }

    return context.json(200);
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "User ID is required" }, 400);
    }

    const softDeleteUserUsecase = new SoftDeleteUserUsecase(this.userRepository);
    const result = await softDeleteUserUsecase.execute(id);

    if (result instanceof Error) {
      return exhaustive(result.name, {
        UserNotFoundError: () => context.json({ message: "User not found" }, 404)
      });
    }

    return context.json(204);
  }
}
