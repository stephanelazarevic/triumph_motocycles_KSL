import { PasswordService } from '../../../../application/services/PasswordService.ts';
import { TokenGeneratorService } from '../../../../application/services/TokenGeneratorService.ts';
import { PhoneNumberService } from '../../../../application/services/PhoneNumberService.ts';
import { CountryService } from '../../../../application/services/CountryService.ts';
import { EmailService } from '../../../../application/services/EmailService.ts';

import { BCryptPasswordService } from '../../../../infrastructure/services/BCryptPasswordService.ts';
import { JwtTokenService } from '../../../../infrastructure/services/JwtTokenService.ts';
import { LibPhoneNumberService } from '../../../../infrastructure/services/LibPhoneNumberService.ts';
import { I18nCountryService } from '../../../../infrastructure/services/I18nCountryService.ts';
import { ResendEmailService } from '../../../../infrastructure/services/ResendEmailService.ts';
import { MotorcycleHistoryService } from '../../../../application/services/MotorcycleHistoryService.ts';
import { incidentRepository, maintenanceRepository } from './repositoriesDependencies.ts';

export const emailService: EmailService                     = new ResendEmailService();
export const passwordService: PasswordService               = new BCryptPasswordService();
export const tokenGeneratorService: TokenGeneratorService   = new JwtTokenService("oiujyhgtfghjkhgfghjk");
export const phonenNumberService: PhoneNumberService        = new LibPhoneNumberService();
export const countryService: CountryService                 = new I18nCountryService();
export const motorcycleHistoryService: MotorcycleHistoryService = new MotorcycleHistoryService(incidentRepository, maintenanceRepository)
