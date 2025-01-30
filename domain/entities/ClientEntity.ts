import { Entity } from "./Entity.ts";
import { UserEntity } from "./UserEntity.ts";

export class ClientEntity extends Entity {
  private constructor(
    id: string,
    public user: UserEntity,
    public dealerId: string,
  ) {
    super(id);
  }

  public static create(params: {
    user: UserEntity;
    dealerId: string;
  }): ClientEntity {
    return new ClientEntity(
      crypto.randomUUID(),
      params.user,
      params.dealerId
    );
  }
}
