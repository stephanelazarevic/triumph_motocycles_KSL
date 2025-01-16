import bcrypt from "npm:bcryptjs";
import { PasswordService } from "domain/services/PasswordService.ts";
import { Password } from "domain/types/Password.ts";

export class BCryptPasswordService implements PasswordService {
  public async hashPassword(password: Password): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
