import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { CreateUserUsecase } from "../user/CreateUserUsecase.ts";

export class CreateEnterpriseUsecase {
  private readonly createUserUsecase: CreateUserUsecase;

  public constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    createUserUsecase: CreateUserUsecase,
  ) {
    this.createUserUsecase = createUserUsecase;
  }

  public async execute(
    firstname: string,
    lastname: string,
    emailAddress: string,
    plainPassword: string,
    phoneNumber: string,
    street: string,
    postalCode: string,
    countryCode: string,
    taxNumber: string,
    industryType: string,
  ) {
    const userEntity = await this.createUserUsecase.execute(
      firstname,
      lastname,
      emailAddress,
      plainPassword,
      phoneNumber,
      street,
      postalCode,
      countryCode,
      false,
    );

    if (userEntity instanceof Error) {
      return userEntity;
    }

    const enterprise = EnterpriseEntity.create(
      userEntity,
      taxNumber,
      industryType,
    );

    if (enterprise instanceof Error) {
      return enterprise;
    }

    await this.enterpriseRepository.save(enterprise);
  }
}
