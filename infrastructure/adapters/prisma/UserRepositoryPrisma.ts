import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";

export class UserRepositoryPrisma implements UserRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(user: UserEntity): Promise<void> {
    await this.prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        firstname: user.firstname.getValue(),
        lastname: user.lastname.getValue(),
        emailAddress: user.emailAddress.getValue(),
        hashedPassword: user.hashedPassword,
        phoneNumber: user.phoneNumber.getValue(),
        address: user.address.getValue(),
        isAdministrator: user.isAdministrator,
        token: user.token
      },
      update: {
        id: user.id,
        firstname: user.firstname.getValue(),
        lastname: user.lastname.getValue(),
        emailAddress: user.emailAddress.getValue(),
        hashedPassword: user.hashedPassword,
        phoneNumber: user.phoneNumber?.getValue(),
        address: user.address.getValue(),
        isAdministrator: user.isAdministrator,
        token: user.token
      }
    });
  }

  public async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users.map(user =>
      UserEntity.reconstitute({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        emailAddress: user.emailAddress,
        hashedPassword: user.hashedPassword,
        phoneNumber: user.phoneNumber,
        address: user.address,
        isAdministrator: user.isAdministrator,
        token: user.token || undefined
      })
    );
  }

  public async findOneById(id: string): Promise<UserEntity | UserNotFoundError> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return new UserNotFoundError();
    }

    return UserEntity.reconstitute({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      emailAddress: user.emailAddress,
      hashedPassword: user.hashedPassword,
      phoneNumber: user.phoneNumber,
      address: user.address,
      isAdministrator: user.isAdministrator,
      token: user.token || undefined
    });
  }

  public async findByEmail(email: EmailAddress): Promise<UserEntity | UserNotFoundError> {
    const user = await this.prisma.user.findUnique({
      where: { emailAddress: email.getValue() }
    });

    if (!user) {
      return new UserNotFoundError();
    }
    console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOH");

    return UserEntity.reconstitute({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      emailAddress: user.emailAddress,
      hashedPassword: user.hashedPassword,
      phoneNumber: user.phoneNumber,
      address: user.address,
      isAdministrator: user.isAdministrator,
      token: user.token || undefined
    });
  }

  public async updateToken(id: string, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
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
      firstname: user.firstname,
      lastname: user.lastname,
      emailAddress: user.emailAddress,
      hashedPassword: user.hashedPassword,
      phoneNumber: user.phoneNumber,
      address: user.address,
      isAdministrator: user.isAdministrator,
      token: user.token || undefined
    });
  }

  public async removeToken(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { token: null }
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}