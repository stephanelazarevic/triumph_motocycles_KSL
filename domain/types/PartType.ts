export interface AddPartCommand {
  dealerId: string,
  reference: string,
  type: string,
  price: number,
  stockQuantity: number
}

export interface UpdatePartCommand extends Partial<AddPartCommand> {}
