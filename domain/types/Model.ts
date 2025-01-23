import { ModelLengthTooShortError } from "../errors/ModelLengthTooShortError.ts";

export class Model {
  private constructor(public readonly value: string) {}

  public static from(value: string) {
    if (value.trim().length < 3) {
      return new ModelLengthTooShortError();
    }

    return new Model(value);
  }
}
