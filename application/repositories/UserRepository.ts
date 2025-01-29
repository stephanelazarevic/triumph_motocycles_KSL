import { User } from "../../domain/entities/User.ts";
import { UserNotFoundError } from "../../domain/errors/UserNotFoundError.ts";

export interface UserRepository {
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findOneById(id: string): Promise<User | UserNotFoundError>;
  findByEmail(email: string): Promise<User | UserNotFoundError>;
  delete(id: string): Promise<void>;
}
