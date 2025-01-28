import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { CreateUserUsecase } from "../user/CreateUserUsecase.ts";

export class CreateDealerUsecase {
  private readonly createUserUsecase: CreateUserUsecase;

  public constructor(
    private readonly dealerRepository: DealerRepository,
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
    site: string,
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

    const dealer = DealerEntity.create(userEntity, site);

    await this.dealerRepository.save(dealer);
  }
}
