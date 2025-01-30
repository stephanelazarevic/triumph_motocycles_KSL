import { IncidentRepository } from "../../repositories/IncidentRepository.ts";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError.ts";

export class DeleteIncidentUsecase {
  constructor(private incidentRepository: IncidentRepository) {}

  public async execute(id: string): Promise<IncidentNotFoundError | void> {
    const existing = await this.incidentRepository.findOneById(id);
    if (!existing) {
      return new IncidentNotFoundError();
    }
    await this.incidentRepository.delete(id);
  }
}
