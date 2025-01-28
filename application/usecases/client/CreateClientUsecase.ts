import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { CreateUserUsecase } from "../user/CreateUserUsecase.ts";
import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";

export class CreateClientUsecase {
  private readonly createUserUsecase: CreateUserUsecase;

  constructor(
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
    dealerId: string,
  ): Promise<ClientEntity | Error> {
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

    const dealer = await this.dealerRepository.findOneById(dealerId);
    if (dealer instanceof Error) {
      return dealer;
    }

    const client = ClientEntity.create(userEntity, dealer.id);

    return client;
  }
}
