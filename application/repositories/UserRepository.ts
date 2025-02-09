import { UserEntity } from "../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError.ts";
import { EmailAddress } from "../../domain/value-objects/EmailAddress.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface UserRepository extends EntityRepositoryInterface<UserEntity> {
  save(user: UserEntity): Promise<void>;
  findAll(): Promise<UserEntity[]>;
  findOneById(id: string): Promise<UserEntity | UserNotFoundError>;
  findByEmail(email: EmailAddress): Promise<UserEntity | UserNotFoundError>;
  updateToken(id: string, token: string): Promise<void>;
  findByToken(token: string): Promise<UserEntity | UserNotFoundError>;
  removeToken(id: string):  Promise<void>;
  delete(id: string): Promise<void>;
}
