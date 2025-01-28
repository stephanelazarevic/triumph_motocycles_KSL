import { EnterpriseIndustryTypeError } from "../errors/EnterpriseIndustryTypeError.ts";
import { IndustryTypeEnum } from "../enum/IndustryTypeEnum.ts";

export class IndustryType {
  private constructor(public readonly value: string) {}

  public static from(industryType: string) {
    if (!(industryType in IndustryTypeEnum)) {
      return new EnterpriseIndustryTypeError();
    }

    return new IndustryType(industryType);
  }
}
