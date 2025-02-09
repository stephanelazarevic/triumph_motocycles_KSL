import { prisma } from "../seed.ts";

export const loadOrderFixtures = async() => {
  const order = await prisma.order.create({
    data: {
      parts: JSON.stringify([{ name: "Part 1", quantity: 2 }]),
      orderDate: new Date(),
      status: "confirmed",
      totalAmount: 1500,
    },
  });

  return {
    orderId: order.id,
  }
}