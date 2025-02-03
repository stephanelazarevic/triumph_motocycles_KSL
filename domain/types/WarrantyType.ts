export interface AddWarrantyCommand {
  startDate: Date,
  endDate: Date,
  motorcycleId: string,
  type: string,
  terms: string,
}

export interface UpdateWarrantyCommand extends Partial<AddWarrantyCommand> {}
