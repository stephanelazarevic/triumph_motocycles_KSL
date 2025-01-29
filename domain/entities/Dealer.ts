import { Entity } from "./Entity.ts";
import { User } from "./User.ts";

export class Dealer extends Entity {
  private constructor(
    id: string,
    public user: User,
    public site: string,
  ) {
    super(id);
  }


  public static create(params: {
    user: User;
    site: string;
  }): Dealer {
    return new Dealer(
      crypto.randomUUID(),
      params.user,
      params.site
    );
  }
}
