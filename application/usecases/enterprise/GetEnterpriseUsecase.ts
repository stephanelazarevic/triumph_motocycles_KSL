import { Enterprise } from "../../../domain/entities/Enterprise.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";

export class GetEnterpriseUsecase {
  constructor(private enterpriseRepository: EnterpriseRepository) {}

  public async execute(id: string): Promise<Enterprise | EnterpriseNotFoundError> {
    const existingEnterprise = await this.enterpriseRepository.findOneById(id);
    if (!existingEnterprise) {
      return new EnterpriseNotFoundError();
    }
    return existingEnterprise;
  }
}
