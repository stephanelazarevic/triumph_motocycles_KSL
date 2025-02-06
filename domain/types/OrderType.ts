import { OrderStatus } from "../enum/OrderEnum"

export interface OrderParts {
    partId: string,
    quantity: number
  }
  
export interface AddOrderCommand {
  parts: OrderParts,
  orderDate: Date,
  status: OrderStatus,
  totalAmount: number,
}

export interface updateOrderCommand extends Partial<AddOrderCommand> {
}  