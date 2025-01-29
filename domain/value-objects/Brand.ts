import { BrandLengthTooShortError } from "../errors/BrandLengthTooShortError.ts";

export class Brand {
  private constructor(public readonly value: string) {}

  public static from(value: string) {
    if (value.trim().length < 3) {
      return new BrandLengthTooShortError();
    }

    return new Brand(value);
  }
}
