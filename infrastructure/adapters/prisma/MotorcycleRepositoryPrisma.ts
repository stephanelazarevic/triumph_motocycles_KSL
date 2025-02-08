import { PrismaClient } from "@prisma/client";
import { MotorcycleRepository } from "../../../application/repositories/MotorcycleRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";

export class MotorcycleRepositoryPrisma implements MotorcycleRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(motorcycle: MotorcycleEntity): Promise<void> {
    await this.prisma.motorcycle.create({
      data: motorcycle
    });
  }

  public async findAll(): Promise<MotorcycleEntity[]> {
    return await this.prisma.motorcycle.findMany();
  }

  public async findOneById(id: string): Promise<MotorcycleEntity | MotorcycleNotFoundError> {
    const motorcycle = await this.prisma.motorcycle.findUnique({
      where: { id }
    });

    return motorcycle ?? new MotorcycleNotFoundError();
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.motorcycle.delete({
      where: { id }
    });
  }
}
