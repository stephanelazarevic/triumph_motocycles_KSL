import { MotorcycleRepository } from '../../../../application/repositories/MotorcycleRepository.ts';
import { MotorcycleRepositoryPrisma } from '../../../adapters/prisma/MotorcycleRepositoryPrisma.ts';
import { prisma } from "./prisma.db.ts";

export const motorcycleRepository: MotorcycleRepository = new MotorcycleRepositoryPrisma(prisma);
