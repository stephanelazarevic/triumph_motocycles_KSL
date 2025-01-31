import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import type { UserRepository } from "../../repositories/UserRepository.ts";

export class ListUsersUsecase {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }
}
