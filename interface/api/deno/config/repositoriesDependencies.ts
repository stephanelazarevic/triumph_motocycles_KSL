import { MotorcycleRepository } from '../../../../application/repositories/MotorcycleRepository.ts';
import { UserRepository } from '../../../../application/repositories/UserRepository.ts';
import { DealerRepository } from '../../../../application/repositories/DealerRepository.ts';
import { WarrantyRepository } from '../../../../application/repositories/WarrantyRepository.ts';
import { MotorcycleHistoryRepository } from '../../../../application/repositories/MotorcycleHistoryRepository.ts';

import { MotorcycleRepositoryPrisma } from '../../../../infrastructure/adapters/prisma/MotorcycleRepositoryPrisma.ts';
import { UserRepositoryPrisma } from '../../../../infrastructure/adapters/prisma/UserRepositoryPrisma.ts';
import { DealerRepositoryPrisma } from '../../../../infrastructure/adapters/prisma/DealerRepositoryPrisma.ts';
import { WarrantyRepositoryPrisma } from '../../../../infrastructure/adapters/prisma/WarrantyRepositoryPrisma.ts';
import { MotorcycleHistoryRepositoryPrisma } from '../../../../infrastructure/adapters/prisma/MotorcycleHistoryRepositoryPrisma.ts';

import { prisma } from "./prisma.db.ts";

export const motorcycleRepository: MotorcycleRepository                = new MotorcycleRepositoryPrisma(prisma);
export const userRepository: UserRepository                            = new UserRepositoryPrisma(prisma);
export const dealerRepository: DealerRepository                        = new DealerRepositoryPrisma(prisma);
export const warrantyRepository: WarrantyRepository                    = new WarrantyRepositoryPrisma(prisma);
export const motorcycleHistoryRepository: MotorcycleHistoryRepository  = new MotorcycleHistoryRepositoryPrisma(prisma);

