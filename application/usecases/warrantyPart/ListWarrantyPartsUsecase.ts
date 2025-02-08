import { WarrantyPartEntity } from "../../../domain/entities/WarrantyPartEntity.ts";
import { WarrantyPartRepository } from "../../repositories/WarrantyPartRepository.ts";

export class ListWarrantyPartsUsecase {
  public constructor(
    private readonly warrantyPartRepository: WarrantyPartRepository,
  ) {}

  public async execute(): Promise<WarrantyPartEntity[]> {
    return await this.warrantyPartRepository.findAll();
  }
}
