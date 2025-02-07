import { OrderStatus } from "../enum/OrderEnum"

export interface PartQuantityToOrder {
    partId: string,
    quantity: number
  }
  
export interface AddOrderCommand {
  parts: Array<PartQuantityToOrder>,
  orderDate: Date,
  status: OrderStatus,
  totalAmount: number,
}

export interface updateOrderCommand extends Partial<AddOrderCommand> {
}  