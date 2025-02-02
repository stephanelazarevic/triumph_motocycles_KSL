import { UserRepository } from "../../repositories/UserRepository.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";

export class SoftDeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(id: string): Promise<void | UserNotFoundError> {
    const user = await this.userRepository.findOneById(id);
    if (user instanceof UserNotFoundError) {
      return new UserNotFoundError();
    }

    user.markAsDeleted();

    await this.userRepository.save(user);
  }
}
