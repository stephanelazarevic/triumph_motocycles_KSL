import { EnterpriseIndustryTypeError } from "../errors/EnterpriseIndustryTypeError.ts";

export enum IndustryTypeEnum {
  Technology = "Technology",
  Healthcare = "Healthcare",
  Finance = "Finance",
  Education = "Education",
  Retail = "Retail",
  Manufacturing = "Manufacturing",
  Energy = "Energy",
  RealEstate = "Real Estate",
  Hospitality = "Hospitality",
  Transportation = "Transportation",
  Agriculture = "Agriculture",
  Entertainment = "Entertainment",
}

export class IndustryType {
  private constructor(public readonly value: string) {}

  public static from(industryType: string) {
    if (!(industryType in IndustryTypeEnum)) {
      return new EnterpriseIndustryTypeError();
    }

    return new IndustryType(industryType);
  }
}
