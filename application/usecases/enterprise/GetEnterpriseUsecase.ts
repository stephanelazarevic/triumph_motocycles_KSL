import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";

export class GetEnterpriseUsecase {
  constructor(private enterpriseRepository: EnterpriseRepository) {}

  public async execute(id: string): Promise<EnterpriseEntity | EnterpriseNotFoundError> {
    const existingEnterprise = await this.enterpriseRepository.findOneById(id);
    if (!existingEnterprise) {
      return new EnterpriseNotFoundError();
    }
    return existingEnterprise;
  }
}
