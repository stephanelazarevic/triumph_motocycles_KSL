import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";

export class MotorcycleEntity {
  private constructor(
    public identifier: string,
    public dealerIdentifier: string,
    public brand: Brand,
    public model: Model,
    public year: number,
    public registrationNumber: number,
    public motorcycleStatus: MotorcycleStatus,
    public clientIdentifier?: string,
    public driverIdentifier?: string,
  ) {}

  public static idVerification(clientIdentifier?: string, driverIdentifier?:string): void{
    if(clientIdentifier && driverIdentifier){
      throw new Error("Cannot assign a motorcycle to both a client and a driver");
    }
  }

  public static create(dealerIdentifier: string, brand: Brand, model: Model, year: number, registrationNumber: number, motorcycleStatus: MotorcycleStatus, clientIdentifier?: string, driverIdentifier?:string): MotorcycleEntity {
    MotorcycleEntity.idVerification(clientIdentifier, driverIdentifier);

    const identifier = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new MotorcycleEntity(
      identifier,
      dealerIdentifier,
      brand,
      model,
      year,
      registrationNumber,
      motorcycleStatus
    );
  }
}
