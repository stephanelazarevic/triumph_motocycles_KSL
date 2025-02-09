import { prisma } from "../seed.ts";

export const loadPartFixtures = async(
  dealerId: string,
  orderId: string
) => {
  const part = await prisma.part.create({
    data: {
      reference: "REF123",
      type: "Engine",
      price: 750,
      stockQuantity: 5,
      idDealer: dealerId,
      idOrder: orderId,
    },
  });

  return {
    partId: part.id
  }
}