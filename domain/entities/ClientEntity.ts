import { UserEntity } from "./UserEntity.ts";

export class ClientEntity {
  private constructor(
    public readonly id: string,
    public readonly user: UserEntity,
    public readonly dealerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(
    user: UserEntity,
    dealerId: string,
  ): ClientEntity | Error {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new ClientEntity(id, user, dealerId, createdAt, updatedAt);
  }
}
