import { RentalEntity } from "../../../domain/entities/RentalEntity.ts";
import type { RentalRepository } from "../../repositories/RentalRepository.ts";

export class ListRentalsUsecase {
  public constructor(
    private readonly rentalRepository: RentalRepository
  ) {}

  public async execute(): Promise<RentalEntity[]> {
    return await this.rentalRepository.findAll();
  }
}
