import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { SoftDeleteUserUsecase } from "../user/SoftDeleteUserUsecase.ts";

export class SoftDeleteEnterpriseUsecase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly softDeleteUserUscase: SoftDeleteUserUsecase,
  ) {}

  public async execute(id: string): Promise<void> {
    const enterprise = await this.enterpriseRepository.findOneById(id);
    if (enterprise instanceof EnterpriseNotFoundError) {
      throw enterprise;
    }

    await this.softDeleteUserUscase.execute(enterprise.user.id);
    enterprise.deletedAt = new Date();
    enterprise.markAsUpdated();
    await this.enterpriseRepository.save(enterprise);
  }
}
