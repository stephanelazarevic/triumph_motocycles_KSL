import { EnterpriseInvalidTaxNumberError } from "../errors/EnterpriseInvalidTaxNumberError.ts";

export class TaxNumber {
  private constructor(public readonly value: string) {}

  public static from(taxNumber: string) {
    const taxNumberRegex = new RegExp(/^[A-Z]{2}[0-9]{8}$/);
    if (!taxNumberRegex.test(taxNumber)) {
      return new EnterpriseInvalidTaxNumberError();
    }

    return new TaxNumber(taxNumber);
  }
}
