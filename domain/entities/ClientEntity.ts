import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class ClientEntity extends Entity {
  private constructor(
    public user: UserEntity,
    public dealerId: string,
  ) {
    super();
  }

  public static create(params: {
    user: UserEntity;
    dealerId: string;
  }): ClientEntity {
    return new ClientEntity(
      params.user,
      params.dealerId,
    );
  }

  static reconstitute(data: {
    id: string;
    dealerId: string;
    user: UserEntity;
  }): ClientEntity {
    return new ClientEntity(
      data.user,
      data.dealerId,
      data.id
    );
  }
}
