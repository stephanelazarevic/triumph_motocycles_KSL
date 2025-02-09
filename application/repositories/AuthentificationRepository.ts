import { UserEntity } from "../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError.ts";

export interface AuthentificationRepository {
  findByEmail(email: string): Promise<UserEntity | UserNotFoundError>;
  save(user: UserEntity): Promise<void>;
  updateToken(userId: string, token: string): Promise<void>;
  findByToken(token: string): Promise<UserEntity | UserNotFoundError>;
  removeToken(userId: string): Promise<void>;
}