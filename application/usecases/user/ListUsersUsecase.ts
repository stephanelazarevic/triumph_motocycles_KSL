import { User } from "../../../domain/entities/User.ts";
import type { UserRepository } from "../../repositories/UserRepository.ts";

export class ListUsersUsecase {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
