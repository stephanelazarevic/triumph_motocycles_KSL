import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class ClientEntity extends Entity {
  private constructor(
    public user: UserEntity,
    public dealerId: string,
    id?: string
  ) {
    super(id);
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
}
