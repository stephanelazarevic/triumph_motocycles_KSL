import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";

export class UpdateEnterpriseUsecase {
  constructor(private enterpriseRepository: EnterpriseRepository) {}

  public async execute(
    dealer: EnterpriseEntity,
  ): Promise<EnterpriseNotFoundError | void> {
    const existingEnterprise = await this.enterpriseRepository.findOneById(
      dealer.id,
    );
    if (!existingEnterprise) {
      return new EnterpriseNotFoundError();
    }
    await this.enterpriseRepository.save(dealer);
  }
}
