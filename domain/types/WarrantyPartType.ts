export interface AddWarrantyPartCommand {
    warrantyId: string,
    partId: string,
    coveredCost: number,
    remainingCost: number,
  }
  
  export interface UpdateWarrantyPartCommand extends Partial<AddWarrantyPartCommand> {}
  