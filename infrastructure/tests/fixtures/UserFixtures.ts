import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { NameType } from "../../../domain/enum/NameEnum.ts";
import { Address } from "../../../domain/value-objects/Address.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { Name } from "../../../domain/value-objects/Name.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";

const firstname = Name.from("John", NameType.FIRSTNAME) as Name;
const lastname = Name.from("Doe", NameType.LASTNAME) as Name;
const emailAddress = EmailAddress.from( "pierre.robin@gmail.com") as EmailAddress;
const hashedPassword = "poiujhgvtysd555555hj";
const phoneNumber = PhoneNumber.from("0624252627") as PhoneNumber;
const address = Address.from({
  street: "1st street",
  postalCode: "12345",
  countryCode: "US"
}) as Address;

export const userJohnDoe = UserEntity.create({
  firstname,
  lastname,
  emailAddress,
  hashedPassword,
  phoneNumber,
  address,
}) as UserEntity;
