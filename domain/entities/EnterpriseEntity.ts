import { IndustryType } from "../value-objects/IndustryType.ts";
import { TaxNumber } from "../value-objects/TaxNumber.ts";
import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class EnterpriseEntity extends Entity {
  private constructor(
    public user: UserEntity,
    public taxNumber: TaxNumber,
    public industryType: IndustryType,
    id?: string
  ) {
    super(id);
  }

  public static create(params: {
    user: UserEntity;
    taxNumber: TaxNumber;
    industryType: IndustryType;
  }): EnterpriseEntity {
    return new EnterpriseEntity(
      params.user,
      params.taxNumber,
      params.industryType,
    );
  }

  static reconstitute(data: {
    id: string;
    user: UserEntity;
    taxNumber: string;
    industryType: string;
  }): EnterpriseEntity {
    return new EnterpriseEntity(
      data.user,
      TaxNumber.reconstitute(data.taxNumber),
      IndustryType.reconstitute(data.taxNumber),
      data.id
    );
  }
}
