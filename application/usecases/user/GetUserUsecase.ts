import { User } from "../../../domain/entities/User.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";

export class GetUserUsecase {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string): Promise<User | UserNotFoundError> {
    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser) {
      return new UserNotFoundError();
    }
    return existingUser;
  }
}
