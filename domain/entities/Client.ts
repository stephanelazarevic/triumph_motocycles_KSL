import { Entity } from "./Entity.ts";
import { User } from "./User.ts";

export class Client extends Entity {
  private constructor(
    id: string,
    public user: User,
    public dealerId: string,
  ) {
    super(id);
  }

  public static create(params: {
    user: User;
    dealerId: string;
  }): Client {
    return new Client(
      crypto.randomUUID(),
      params.user,
      params.dealerId
    );
  }
}
