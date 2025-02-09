import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { AuthentificationRepository } from "../../../application/repositories/AuthentificationRepository.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { Name } from "../../../domain/value-objects/Name.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";
import { Address } from "../../../domain/value-objects/Address.ts";

export class AuthentificationRepositoryPrisma implements AuthentificationRepository {
  public constructor(private prisma: PrismaClient) {}

  public async findByEmail(email: string): Promise<UserEntity | UserNotFoundError> {
    const user = await this.prisma.user.findUnique({
      where: { emailAddress: email }
    });

    if (!user) {
      return new UserNotFoundError();
    }

    return UserEntity.reconstitute({
      id: user.id,
      firstname: new Name(user.firstname),
      lastname: new Name(user.lastname),
      emailAddress: new EmailAddress(user.emailAddress),
      hashedPassword: user.hashedPassword,
      phoneNumber: new PhoneNumber(user.phoneNumber),
      address: new Address({
        street: user.street,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country
      }),
      isAdministrator: user.isAdministrator,
      token: user.token || undefined
    });
  }

  public async save(user: UserEntity): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        firstname: user.firstname.value,
        lastname: user.lastname.value,
        emailAddress: user.emailAddress.value,
        hashedPassword: user.hashedPassword,
        phoneNumber: user.phoneNumber.value,
        street: user.address.street,
        city: user.address.city,
        zipCode: user.address.zipCode,
        country: user.address.country,
        isAdministrator: user.isAdministrator,
        token: user.token
      }
    });
  }

  public async updateToken(userId: string, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { token }
    });
  }

  public async findByToken(token: string): Promise<UserEntity | UserNotFoundError> {
    const user = await this.prisma.user.findFirst({
      where: { token }
    });

    if (!user) {
      return new UserNotFoundError();
    }

    return UserEntity.reconstitute({
      id: user.id,
      firstname: new Name(user.firstname),
      lastname: new Name(user.lastname),
      emailAddress: new EmailAddress(user.emailAddress),
      hashedPassword: user.hashedPassword,
      phoneNumber: new PhoneNumber(user.phoneNumber),
      address: new Address({
        street: user.street,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country
      }),
      isAdministrator: user.isAdministrator,
      token: user.token || undefined
    });
  }

  public async removeToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { token: null }
    });
  }
}