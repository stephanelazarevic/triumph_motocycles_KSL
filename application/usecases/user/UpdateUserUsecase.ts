import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";

export class UpdateUserUsecase {
  constructor(private maintenanceRepository: UserRepository) {}

  public async execute(user: UserEntity): Promise<UserNotFoundError | void> {
    const existingUser = await this.maintenanceRepository.findOneById(user.id);
    if (!existingUser) {
      return new UserNotFoundError();
    }
    await this.maintenanceRepository.save(user);
  }
}
