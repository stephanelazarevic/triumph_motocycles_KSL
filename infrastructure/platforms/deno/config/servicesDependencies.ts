import { PasswordService } from '../../../../application/services/PasswordService.ts';
import { TokenGeneratorService } from '../../../../application/services/TokenGeneratorService.ts';
import { PhoneNumberService } from '../../../../application/services/PhoneNumberService.ts';
import { CountryService } from '../../../../application/services/CountryService.ts';

import { BCryptPasswordService } from '../../../services/BCryptPasswordService.ts';
import { JwtTokenService } from '../../../services/JwtTokenService.ts';
import { LibPhoneNumberService } from '../../../services/LibPhoneNumberService.ts';
import { I18nCountryService } from '../../../services/I18nCountryService.ts';

export const passwordService: PasswordService               = new BCryptPasswordService();
export const tokenGeneratorService: TokenGeneratorService   = new JwtTokenService("oiujyhgtfghjkhgfghjk");
export const phonenNumberService: PhoneNumberService        = new LibPhoneNumberService();
export const countryService: CountryService                 = new I18nCountryService();
