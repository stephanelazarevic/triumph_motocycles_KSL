import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class DealerEntity extends Entity {
  private constructor(
    id: string,
    public user: UserEntity,
    public site: string,
  ) {
    super(id);
  }

  public static create(params: {
    user: UserEntity;
    site: string;
  }): DealerEntity {
    return new DealerEntity(
      crypto.randomUUID(),
      params.user,
      params.site,
    );
  }
}
