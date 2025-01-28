import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import type { UserRepository } from "../../repositories/UserRepository.ts";

export class FindAllUsersUsecase {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }
}
