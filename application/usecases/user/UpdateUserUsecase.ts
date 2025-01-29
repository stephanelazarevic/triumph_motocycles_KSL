import { UserRepository } from "../../repositories/UserRepository.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { EmailAddress } from "../../../domain/types/EmailAddress.ts";
import { PhoneNumber } from "libphonenumber-js";
import { Address } from "../../../domain/types/Address.ts";

export interface UserUpdatePayload {
  firstname?: string;
  lastname?: string;
  emailAddress?: string;
  hashedPassword?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    postalCode: string;
    countryCode: string;
  };
  isAdministrator?: boolean;
}

export type UserData = {
  firstname?: string;
  lastname?: string;
  emailAddress?: EmailAddress;
  hashedPassword?: string;
  phoneNumber?: PhoneNumber;
  address?: Address;
  isAdministrator?: boolean;
}

export class UpdateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  public async execute(userId: string, payload: UserUpdatePayload): Promise<Error | void> {
    const existingUser = await this.userRepository.findOneById(userId);
    if (existingUser instanceof UserNotFoundError) {
      return existingUser;
    }

    const transformedData = await this.transformPayload(payload);
    if (transformedData instanceof Error) {
      return transformedData;
    }

    const updatedUser = existingUser.update(
      transformedData.firstname,
      transformedData.lastname,
      transformedData.emailAddress,
      transformedData.hashedPassword,
      transformedData.phoneNumber,
      transformedData.address,
      transformedData.isAdministrator
    );

    if (updatedUser instanceof Error) {
      return updatedUser;
    }

    return this.userRepository.save(updatedUser);
  }

  private transformPayload(payload: UserUpdatePayload): Promise<UserData> | Error {
    const transformedData: UserData = {};

    if (payload.firstname !== undefined) {
      transformedData.firstname = payload.firstname;
    }

    if (payload.lastname !== undefined) {
      transformedData.lastname = payload.lastname;
    }

    if (payload.emailAddress !== undefined) {
      const emailAddress = EmailAddress.from(payload.emailAddress);
      if (emailAddress instanceof Error) {
        return emailAddress;
      }
      transformedData.emailAddress = emailAddress;
    }

    if (payload.phoneNumber !== undefined) {
      const phoneNumber = PhoneNumber.from(payload.phoneNumber);
      if (phoneNumber instanceof Error) {
        return phoneNumber;
      }
      transformedData.phoneNumber = phoneNumber;
    }

    if (payload.address !== undefined) {
      const address = Address.from(
        payload.address.street,
        payload.address.postalCode,
        payload.address.countryCode
      );
      if (address instanceof Error) {
        return address;
      }
      transformedData.address = address;
    }

    if (payload.hashedPassword !== undefined) {
      transformedData.hashedPassword = payload.hashedPassword;
    }

    if (payload.isAdministrator !== undefined) {
      transformedData.isAdministrator = payload.isAdministrator;
    }

    return Promise.resolve(transformedData);
  }
}
