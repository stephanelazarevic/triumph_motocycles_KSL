import { Enterprise } from "../../../domain/entities/Enterprise.ts";
import { AddEnterpriseCommand } from "../../../domain/types/EnterpriseType.ts";
import { IndustryType } from "../../../domain/value-objects/IndustryType.ts";
import { TaxNumber } from "../../../domain/value-objects/TaxNumber.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { AddUserUsecase } from "../user/AddUserUsecase.ts";

export class AddEnterpriseUsecase {
  public constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly addUserUsecase: AddUserUsecase,
  ) {
    this.addUserUsecase = addUserUsecase;
  }

  public async execute(command: AddEnterpriseCommand) {
    const user = await this.addUserUsecase.execute({
      firstname: command.firstname,
      lastname: command.lastname,
      emailAddress: command.emailAddress,
      plainPassword: command.plainPassword,
      phoneNumber: command.phoneNumber,
      address: command.address,
    });
    if (user instanceof Error) {
      return user;
    }

    const validTaxNumber = TaxNumber.from(command.taxNumber);
    if (validTaxNumber instanceof Error) {
      return validTaxNumber;
    }

    const validIndustryType = IndustryType.from(command.industryType);
    if (validIndustryType instanceof Error) {
      return validIndustryType;
    }

    const enterprise = Enterprise.create( {
      user,
      taxNumber: validTaxNumber,
      industryType: validIndustryType,
    });
    if (enterprise instanceof Error) {
      return enterprise;
    }

    await this.enterpriseRepository.save(enterprise);

    return enterprise;
  }
}
