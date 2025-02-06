export interface AddPartCommand {
  dealerId: string,
  reference: string,
  type: string,
  price: number,
  stockQuantity: number
  orderId?: string,
}

export interface UpdatePartCommand extends Partial<AddPartCommand> {}
