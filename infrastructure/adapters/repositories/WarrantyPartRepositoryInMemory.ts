import type { WarrantyPartRepository } from "../../../application/repositories/WarrantyPartRepository.ts";
import { WarrantyPartEntity } from "../../../domain/entities/WarrantyPartEntity.ts";
import { WarrantyPartNotFoundError } from "../../../domain/errors/WarrantyPartNotFoundError.ts";

export class WarrantyPartRepositoryInMemory implements WarrantyPartRepository {
  public constructor(private warrantyParts: WarrantyPartEntity[]) {}

  public save(warrantyPart: WarrantyPartEntity): Promise<void> {
    const index = this.warrantyParts.findIndex(
      (warrantyPart) => warrantyPart.id === warrantyPart.id,
    );
    if (index === -1) {
      this.warrantyParts.push(warrantyPart);
    } else {
      this.warrantyParts[index] = warrantyPart;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<WarrantyPartEntity[]> {
    return Promise.resolve(this.warrantyParts);
  }

  public findOneById(
    id: string,
  ): Promise<WarrantyPartEntity | WarrantyPartNotFoundError> {
    const foundWarrantyPart = this.warrantyParts.find((warrantyPart) => {
      return warrantyPart.id === id;
    });

    return Promise.resolve(foundWarrantyPart ?? new WarrantyPartNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.warrantyParts = this.warrantyParts.filter(
      (warrantyPart) => warrantyPart.id !== id,
    );
    return Promise.resolve();
  }
}
