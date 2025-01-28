import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(id: string): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (user instanceof UserNotFoundError) {
      throw user;
    }

    await this.userRepository.delete(user.id);

    await this.userRepository.delete(id);
  }
}
