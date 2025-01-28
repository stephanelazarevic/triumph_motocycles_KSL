import { EnterpriseRepository } from "../../../application/repositories/EnterpriseRepository.ts";
import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";

export class EnterpriseRepositoryInMemory implements EnterpriseRepository {
  constructor(private enterprises: EnterpriseEntity[] = []) {}

  /**
   * Saves an enterprise to the repository. If the enterprise exists, it updates the record.
   */
  public save(enterprise: EnterpriseEntity): Promise<void> {
    const index = this.enterprises.findIndex(
      (existingEnterprise) => existingEnterprise.id === enterprise.id
    );
    if (index === -1) {
      this.enterprises.push(enterprise);
    } else {
      this.enterprises[index] = enterprise;
    }
    return Promise.resolve();
  }

  /**
   * Finds all enterprises in the repository.
   */
  public findAll(): Promise<EnterpriseEntity[]> {
    return Promise.resolve(this.enterprises);
  }

  /**
   * Finds a single enterprise by ID. Returns the enterprise or throws an EnterpriseNotFoundError.
   */
  public findById(
    id: string
  ): Promise<EnterpriseEntity | EnterpriseNotFoundError> {
    const foundEnterprise = this.enterprises.find(
      (enterprise) => enterprise.id === id
    );
    return Promise.resolve(foundEnterprise ?? new EnterpriseNotFoundError());
  }

  /**
   * Deletes an enterprise by ID.
   */
  public delete(id: string): Promise<void> {
    this.enterprises = this.enterprises.filter(
      (enterprise) => enterprise.id !== id
    );
    return Promise.resolve();
  }
}
