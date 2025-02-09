import { UserEntity } from "../../domain/entities/UserEntity.ts";

export interface TokenGeneratorService {
  generate(user: UserEntity): Promise<string>;
  verify(token: string): boolean;
}