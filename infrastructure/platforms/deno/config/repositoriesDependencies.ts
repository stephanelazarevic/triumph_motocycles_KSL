import { MotorcycleRepository } from '../../../../application/repositories/MotorcycleRepository.ts';
import { UserRepository } from '../../../../application/repositories/UserRepository.ts';
import { DealerRepository } from '../../../../application/repositories/DealerRepository.ts';
import { WarrantyRepository } from '../../../../application/repositories/WarrantyRepository.ts';

import { MotorcycleRepositoryPrisma } from '../../../adapters/prisma/MotorcycleRepositoryPrisma.ts';
import { UserRepositoryPrisma } from '../../../adapters/prisma/UserRepositoryPrisma.ts';
import { DealerRepositoryPrisma } from '../../../adapters/prisma/DealerRepositoryPrisma.ts';
import { WarrantyRepositoryPrisma } from '../../../adapters/prisma/WarrantyRepositoryPrisma.ts';

import { prisma } from "./prisma.db.ts";

export const motorcycleRepository: MotorcycleRepository     = new MotorcycleRepositoryPrisma(prisma);
export const userRepository: UserRepository                 = new UserRepositoryPrisma(prisma);
export const dealerRepository: DealerRepository             = new DealerRepositoryPrisma(prisma);
export const warrantyRepository: WarrantyRepository         = new WarrantyRepositoryPrisma(prisma);

