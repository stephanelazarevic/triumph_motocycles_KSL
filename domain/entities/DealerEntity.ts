import { UserEntity } from "./UserEntity.ts";

export class DealerEntity {
  private constructor(
    public readonly id: string,
    public readonly user: UserEntity,
    public readonly site: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(user: UserEntity, site: string): DealerEntity {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new DealerEntity(id, user, site, createdAt, updatedAt);
  }
}
