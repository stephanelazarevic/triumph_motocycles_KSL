import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { AddUserUsecase } from "../user/AddUserUsecase.ts";

export class CreateEnterpriseUsecase {
  private readonly createUserUsecase: AddUserUsecase;

  public constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    createUserUsecase: AddUserUsecase,
  ) {
    this.createUserUsecase = createUserUsecase;
  }

  public async execute(
    firstname: string,
    lastname: string,
    emailAddress: string,
    plainPassword: string,
    phoneNumber: string,
    address: {
      street: string;
      postalCode: string;
      countryCode: string;
    },
    taxNumber: string,
    industryType: string,
  ) {
    const userEntity = await this.createUserUsecase.execute({
      firstname,
      lastname,
      emailAddress,
      plainPassword,
      phoneNumber,
      address,
    }
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
