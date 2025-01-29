import { EnterpriseRepository } from "../../../application/repositories/EnterpriseRepository.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";

export class DeleteEnterpriseUsecase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const enterprise = await this.enterpriseRepository.findOneById(id);
    if (enterprise instanceof EnterpriseNotFoundError) {
      throw enterprise;
    }

    await this.userRepository.delete(enterprise.user.id);

    await this.enterpriseRepository.delete(id);
  }
}
