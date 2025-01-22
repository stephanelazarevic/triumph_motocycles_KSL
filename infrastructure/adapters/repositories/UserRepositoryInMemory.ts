import type { UserRepository } from "../../../application/repositories/UserRepository.ts";
import type { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { EmailAddress } from "../../../domain/types/EmailAddress.ts";

export class UserRepositoryInMemory implements UserRepository {
  constructor(private users: UserEntity[] = []) {}

  /**
   * Saves a user to the repository. If the user exists, it updates the record.
   */
  public save(user: UserEntity): Promise<void> {
    const index = this.users.findIndex(
      (existingUser) => existingUser.id === user.id
    );
    if (index === -1) {
      this.users.push(user);
    } else {
      this.users[index] = user;
    }
    return Promise.resolve();
  }

  /**
   * Finds all users in the repository.
   */
  public findAll(): Promise<UserEntity[]> {
    return Promise.resolve(this.users);
  }

  /**
   * Finds a single user by ID. Returns the user or throws a UserNotFoundError.
   */
  public findById(id: string): Promise<UserEntity | UserNotFoundError> {
    const foundUser = this.users.find((user) => user.id === id);
    return Promise.resolve(foundUser ?? new UserNotFoundError());
  }

  /**
   * Finds a single user by email. Returns the user or throws a UserNotFoundError.
   */
  public findByEmail(
    email: EmailAddress
  ): Promise<UserEntity | UserNotFoundError> {
    const foundUser = this.users.find((user) => user.emailAddress === email);
    return Promise.resolve(foundUser ?? new UserNotFoundError());
  }

  /**
   * Deletes a user by ID.
   */
  public delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
    return Promise.resolve();
  }
}
