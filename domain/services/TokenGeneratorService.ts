import { UserEntity } from "../entities/UserEntity";

export interface TokenGeneratorService {
  generate(user: UserEntity): Promise<string>;
  verify(token: string): boolean;
}