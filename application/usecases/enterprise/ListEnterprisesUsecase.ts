import { Enterprise } from "../../../domain/entities/Enterprise.ts";
import type { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";

export class ListEnterprisesUsecase {
  public constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  public async execute(): Promise<Enterprise[]> {
    return await this.enterpriseRepository.findAll();
  }
}
