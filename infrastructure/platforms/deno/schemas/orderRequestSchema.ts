import { z } from "npm:zod";
import { OrderStatus } from "../../../../domain/enum/OrderEnum";

export const orderPartsSchema = z.object({
    partId: z.string(),
    quantity: z.number().int().positive(),
  });

export const addOrderRequestSchema = z.object({
    parts: z.array(orderPartsSchema).nonempty(),
    orderDate: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
    status: z.nativeEnum(OrderStatus),
    totalAmount: z.number().positive(),
});

export const updateOrderRequestSchema = addOrderRequestSchema.partial();
