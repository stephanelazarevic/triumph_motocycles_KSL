export interface AddMaintenanceCommand {
  date: Date,
  description: string,
  motorcycleId: string,
  cost: number,
}

export interface UpdateMaintenanceCommand extends Partial<AddMaintenanceCommand>{}
