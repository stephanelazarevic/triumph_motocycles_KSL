import { EnterpriseInvalidTaxNumberError } from "../errors/EnterpriseInvalidTaxNumberError.ts";

export class TaxNumber {
  private constructor(private readonly value: string) {}

  public static from(taxNumber: string): TaxNumber | Error {
    if (!TaxNumber.isValidTaxNumber(taxNumber)) {
      return new EnterpriseInvalidTaxNumberError();
    }

    return new TaxNumber(taxNumber);
  }

  private static isValidTaxNumber(taxNumber: string): boolean {
    const taxNumberRegex = new RegExp(/^[A-Z]{2}[0-9]{8}$/);
    return taxNumberRegex.test(taxNumber);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(otherTaxNumber: TaxNumber): boolean {
    return this.value === otherTaxNumber.value;
  }

  public static reconstitute (value: string){
    return new TaxNumber(value);
  }
}
