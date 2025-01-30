import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { TaxNumber } from "../../../domain/value-objects/TaxNumber.ts";
import { IndustryType } from "../../../domain/value-objects/IndustryType.ts";
import { UpdateEnterprisePersonalInformationCommand } from "../../../domain/types/EnterpriseType.ts";

export class UpdateEnterpriseInformationUsecase {
  constructor(private enterpriseRepository: EnterpriseRepository) {}

  public async execute(
    enterpriseId: string,
    command: UpdateEnterprisePersonalInformationCommand,
  ): Promise<EnterpriseEntity | Error> {
    const enterprise = await this.enterpriseRepository.findOneById(enterpriseId);
    if (enterprise instanceof EnterpriseNotFoundError) {
      return enterprise;
    }

    if (command.taxNumber !== undefined) {
      const validTaxNumber = TaxNumber.from(command.taxNumber);
      if (validTaxNumber instanceof Error) {
        return validTaxNumber;
      }
      enterprise.taxNumber = validTaxNumber;
      enterprise.markAsUpdated();
    }

    if (command.industryType !== undefined) {
      const validIndustryType = IndustryType.from(command.industryType);
      if (validIndustryType instanceof Error) {
        return validIndustryType;
      }
      enterprise.industryType = validIndustryType;
      enterprise.markAsUpdated();
    }

    await this.enterpriseRepository.save(enterprise);
    return enterprise;
  }
}
