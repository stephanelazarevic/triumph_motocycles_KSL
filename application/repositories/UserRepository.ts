import { UserEntity } from "domain/entities/UserEntity.ts";
import { EmailAddress } from "domain/types/EmailAddress.ts";
import { UserNotFoundError } from "domain/errors/UserNotFoundError.ts";

export interface UserRepository {
  save(user: UserEntity): Promise<void>;
  findById(id: string): Promise<UserEntity | UserNotFoundError>;
  findByEmail(email: EmailAddress): Promise<UserEntity | UserNotFoundError>;
}
