import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";

export class GetUserUsecase {
  constructor(private userRepository: UserRepository) {}

  public async execute(id: string): Promise<UserEntity | UserNotFoundError> {
    const existingUser = await this.userRepository.findOneById(id);
    if (!existingUser) {
      return new UserNotFoundError();
    }
    return existingUser;
  }
}
