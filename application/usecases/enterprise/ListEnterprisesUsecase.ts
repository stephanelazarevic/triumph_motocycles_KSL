import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import type { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";

export class FindAllEnterprisesUsecase {
  public constructor(
    private readonly enterpriseRepository: EnterpriseRepository
  ) {}

  public async execute(): Promise<EnterpriseEntity[]> {
    return await this.enterpriseRepository.findAll();
  }
}
