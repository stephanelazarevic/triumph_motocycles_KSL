import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import type { IncidentRepository } from "../../repositories/IncidentRepository.ts";

export class FindAllIncidentsUsecase {
  public constructor(
    private readonly incidentRepository: IncidentRepository,
  ) {}

  public async execute(): Promise<IncidentEntity[]> {
    return await this.incidentRepository.findAll();
  }
}
