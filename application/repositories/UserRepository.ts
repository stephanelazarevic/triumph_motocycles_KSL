import { User } from "../../domain/entities/User.ts";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError.ts";
import { EmailAddress } from "../../domain/value-objects/EmailAddress.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface UserRepository extends EntityRepositoryInterface<User> {
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findOneById(id: string): Promise<User | UserNotFoundError>;
  findByEmail(email: EmailAddress): Promise<User | UserNotFoundError>;
  delete(id: string): Promise<void>;
}
