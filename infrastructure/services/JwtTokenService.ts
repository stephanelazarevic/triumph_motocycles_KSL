import * as jwt from "npm:jsonwebtoken";
import { TokenGeneratorService } from "../../application/services/TokenGeneratorService.ts";
import { UserEntity } from "../../domain/entities/UserEntity.ts";

export class JwtTokenService implements TokenGeneratorService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = "24h"
  ) {}

  public generate(user: UserEntity): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.emailAddress.getValue(),
      firstName: user.firstname.getValue(),
      lastName: user.lastname.getValue(),
      isAdmin: user.isAdministrator,
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  public verify(token: string): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch {
      return false;
    }
  }
}