import { PartRepository } from "../../../application/repositories/PartRepository.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";

export class PartRepositoryInMemory implements PartRepository {
  public constructor(private parts: PartEntity[]) {}

  public save(part: PartEntity): Promise<void> {
    const index = this.parts.findIndex(
      (part) => part.id === part.id
    );
    if (index === -1) {
      this.parts.push(part);
    } else {
      this.parts[index] = part;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<PartEntity[]> {
    return Promise.resolve(this.parts);
  }

  public findOneById(id: string): Promise<PartEntity | PartNotFoundError> {
    const foundPart = this.parts.find((part) => {
      return part.id === id;
    });

    return Promise.resolve(foundPart ?? new PartNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.parts = this.parts.filter(
      (part) => part.id !== id
    );
    return Promise.resolve();
  }
}
