import { IndustryType } from "../value-objects/IndustryType.ts";
import { TaxNumber } from "../value-objects/TaxNumber.ts";
import { Entity } from "./Entity.ts";
import { User } from "./User.ts";

export class Enterprise extends Entity {
  private constructor(
    id: string,
    public user: User,
    public taxNumber: TaxNumber,
    public industryType: IndustryType,
  ) {
    super(id);
  }

  public static create(params: {
    user: User;
    taxNumber: TaxNumber;
    industryType: IndustryType;
  }): Enterprise {
    return new Enterprise(
      crypto.randomUUID(),
      params.user,
      params.taxNumber,
      params.industryType,
    );
  }
}
