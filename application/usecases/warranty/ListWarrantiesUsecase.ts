import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";

export class ListWarrantiesUsecase {
  public constructor(
    private readonly warrantyRepository: WarrantyRepository,
  ) {}

  public async execute(): Promise<WarrantyEntity[]> {
    return await this.warrantyRepository.findAll();
  }
}
