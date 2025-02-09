import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class DealerEntity extends Entity {
  private constructor(
    public user: UserEntity,
    public site: string,
    id?: string
  ) {
    super(id);
  }

  public static create(params: {
    user: UserEntity;
    site: string;
  }): DealerEntity {
    return new DealerEntity(
      params.user,
      params.site,
    );
  }
}
