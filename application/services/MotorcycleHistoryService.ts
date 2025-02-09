import { MotorcycleHistoryEntity } from "../../domain/entities/MotorcycleHistoryEntity";
import { IncidentRepository } from "../repositories/IncidentRepository";
import { MaintenanceRepository } from "../repositories/MaintenanceRepository";

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
