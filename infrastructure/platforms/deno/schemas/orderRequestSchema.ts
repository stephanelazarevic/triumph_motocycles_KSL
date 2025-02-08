import { z } from "npm:zod";
import { OrderStatus } from "../../../../domain/enum/OrderEnum";

export const orderPartSchema = z.object({
    partId: z.string().uuid("Invalid part UUID"),
    quantity: z.number().int().positive(),
  });

export const addOrderRequestSchema = z.object({
    parts: z.array(orderPartSchema).nonempty(),
    orderDate: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900"),
    status: z.nativeEnum(OrderStatus),
    totalAmount: z.number().positive(),
});

export const updateOrderRequestSchema = addOrderRequestSchema.partial();
