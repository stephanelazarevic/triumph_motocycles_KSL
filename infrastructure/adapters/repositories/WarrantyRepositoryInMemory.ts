import type { WarrantyRepository } from "../../../application/repositories/WarrantyRepository.ts";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";

export class WarrantyRepositoryInMemory implements WarrantyRepository {
  public constructor(private warranties: WarrantyEntity[]) {}

  public save(warranty: WarrantyEntity): Promise<void> {
    const index = this.warranties.findIndex(
      (warranty) => warranty.id === warranty.id,
    );
    if (index === -1) {
      this.warranties.push(warranty);
    } else {
      this.warranties[index] = warranty;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<WarrantyEntity[]> {
    return Promise.resolve(this.warranties);
  }

  public findOneById(
    id: string,
  ): Promise<WarrantyEntity | WarrantyNotFoundError> {
    const foundWarranty = this.warranties.find((warranty) => {
      return warranty.id === id;
    });

    return Promise.resolve(foundWarranty ?? new WarrantyNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.warranties = this.warranties.filter(
      (warranty) => warranty.id !== id,
    );
    return Promise.resolve();
  }
}
