import { IndustryType } from "../value-objects/IndustryType.ts";
import { TaxNumber } from "../value-objects/TaxNumber.ts";
import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class EnterpriseEntity extends Entity {
  private constructor(
    id: string,
    public user: UserEntity,
    public taxNumber: TaxNumber,
    public industryType: IndustryType,
  ) {
    super(id);
  }

  public static create(params: {
    user: UserEntity;
    taxNumber: TaxNumber;
    industryType: IndustryType;
  }): EnterpriseEntity {
    return new EnterpriseEntity(
      crypto.randomUUID(),
      params.user,
      params.taxNumber,
      params.industryType,
    );
  }
}
