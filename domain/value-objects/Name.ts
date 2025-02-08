import { NameTooShortError } from "../errors/NameTooShortError.ts";
import { NameType } from "../enum/NameEnum.ts";

export class Name {
  private constructor(private readonly value: string) {}

  public static from(name: string, type: NameType): Name | Error {
    if (name.trim().length < 2) {
      return new NameTooShortError();
    }

    const formatted = type === NameType.FIRSTNAME ? Name.formatFirstname(name) : Name.formatLastname(name);

    return new Name(formatted);
  }

  private static formatFirstname(name: string): string {
    return name
      .trim()
      .split(/[\s-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("-");
  }

  private static formatLastname(name: string): string {
    return name.trim().toUpperCase();
  }

  public getValue(): string {
    return this.value;
  }

  public static reconstitute (value: string){
    return new Name(value);
  }
}
