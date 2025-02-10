import { MotorcycleHistoryEntity } from "../../domain/entities/MotorcycleHistoryEntity.ts";
import { IncidentRepository } from "../repositories/IncidentRepository.ts";
import { MaintenanceRepository } from "../repositories/MaintenanceRepository.ts";

export class MotorcycleHistoryService {
    constructor(
        private incidentRepository: IncidentRepository,
        private maintenanceRepository: MaintenanceRepository
    ) {}

    async enrichMotorcycleHistories(
        histories: MotorcycleHistoryEntity | MotorcycleHistoryEntity[]
    ): Promise<MotorcycleHistoryEntity | MotorcycleHistoryEntity[]> {
        const historyArray = Array.isArray(histories) ? histories : [histories];

        for (const history of historyArray) {
            history.incidents = await this.incidentRepository.findByMotorcycleIdAndPeriod(
                history.motorcycleId, history.startDate, history.endDate
            );
            history.maintenances = await this.maintenanceRepository.findByMotorcycleIdAndPeriod(
                history.motorcycleId, history.startDate, history.endDate
            );
        }

        return Array.isArray(histories) ? historyArray : historyArray[0];
    }
}
