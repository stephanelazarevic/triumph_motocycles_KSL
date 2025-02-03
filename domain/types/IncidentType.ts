import { IncidentType } from "../enum/IncidentEnum.ts";

export interface AddIncidentCommand {
  description: string,
  motorcycleId: string,
  type: IncidentType,
  reportDate: Date,
  resolutionDate?: Date | null,
  status: string,
}

export interface updateIncidentCommand extends Partial<AddIncidentCommand> {
}
