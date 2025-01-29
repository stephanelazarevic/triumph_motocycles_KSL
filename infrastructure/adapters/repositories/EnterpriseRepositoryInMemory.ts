import { EnterpriseRepository } from "../../../application/repositories/EnterpriseRepository.ts";
import { Enterprise } from "../../../domain/entities/Enterprise.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";

export class EnterpriseRepositoryInMemory implements EnterpriseRepository {
  constructor(private enterprises: Enterprise[] = []) {}

  /**
   * Saves an enterprise to the repository. If the enterprise exists, it updates the record.
   */
  public save(enterprise: Enterprise): Promise<void> {
    const index = this.enterprises.findIndex(
      (existingEnterprise) => existingEnterprise.id === enterprise.id,
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
  public findAll(): Promise<Enterprise[]> {
    return Promise.resolve(this.enterprises);
  }

  /**
   * Finds a single enterprise by ID. Returns the enterprise or throws an EnterpriseNotFoundError.
   */
  public findOneById(
    id: string,
  ): Promise<Enterprise | EnterpriseNotFoundError> {
    const foundEnterprise = this.enterprises.find(
      (enterprise) => enterprise.id === id,
    );
    return Promise.resolve(foundEnterprise ?? new EnterpriseNotFoundError());
  }

  /**
   * Deletes an enterprise by ID.
   */
  public delete(id: string): Promise<void> {
    this.enterprises = this.enterprises.filter(
      (enterprise) => enterprise.id !== id,
    );
    return Promise.resolve();
  }
}
