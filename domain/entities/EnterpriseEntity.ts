import { IndustryType } from "../value-objects/IndustryType.ts";
import { TaxNumber } from "../value-objects/TaxNumber.ts";
import { UserEntity } from "./UserEntity.ts";

export class EnterpriseEntity {
  private constructor(
    public readonly id: string,
    public readonly user: UserEntity,
    public readonly taxNumber: TaxNumber,
    public readonly industryType: IndustryType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(
    user: UserEntity,
    taxNumber: string,
    industryType: string,
  ): EnterpriseEntity | Error {
    const validIndustryType = IndustryType.from(industryType);
    if (validIndustryType instanceof Error) {
      return validIndustryType;
    }

    const validTaxNumber = TaxNumber.from(taxNumber);
    if (validTaxNumber instanceof Error) {
      return validTaxNumber;
    }

    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new EnterpriseEntity(
      id,
      user,
      validTaxNumber,
      validIndustryType,
      createdAt,
      updatedAt,
    );
  }
}
