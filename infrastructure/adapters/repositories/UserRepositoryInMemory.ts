import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";

export class UserRepositoryInMemory implements UserRepository {
  constructor(private users: UserEntity[] = []) {}

  public save(user: UserEntity): Promise<void> {
    const index = this.users.findIndex(
      (existingUser) => existingUser.id === user.id,
    );
    if (index === -1) {
      this.users.push(user);
    } else {
      this.users[index] = user;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<UserEntity[]> {
    return Promise.resolve(this.users);
  }

  public findOneById(id: string): Promise<UserEntity | UserNotFoundError> {
    const foundUser = this.users.find((user) => user.id === id);
    return Promise.resolve(foundUser ?? new UserNotFoundError());
  }

  public findByEmail(email: EmailAddress): Promise<UserEntity | UserNotFoundError> {
    const foundUser = this.users.find(
      (user) => user.emailAddress.getValue() === email.getValue(),
    );
    return Promise.resolve(foundUser ?? new UserNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
    return Promise.resolve();
  }
}
