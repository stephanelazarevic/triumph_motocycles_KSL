import { EnterpriseIndustryTypeError } from "../errors/EnterpriseIndustryTypeError.ts";
import { IndustryTypeEnum } from "../enum/IndustryTypeEnum.ts";

export class IndustryType {
  private constructor(private readonly value: string) {}

  public static from(industryType: string): IndustryType | Error {
    if (!IndustryType.isValidIndustryType(industryType)) {
      return new EnterpriseIndustryTypeError();
    }

    return new IndustryType(industryType);
  }

  private static isValidIndustryType(industryType: string): boolean {
    return Object.values(IndustryTypeEnum).includes(industryType as IndustryTypeEnum);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(industryType: IndustryType): boolean {
    return this.value === industryType.value;
  }
}
