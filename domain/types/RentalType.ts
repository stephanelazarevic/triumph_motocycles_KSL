export interface AddRentalCommand {
  clientId: string,
  motorcycleId: string
  startDate: Date,
  endDate: Date,
  cost: number,
  isCompleted: boolean,
}

export interface UpdateRentalCommand extends Partial<AddRentalCommand> {}
