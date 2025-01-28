import { BreakdownRepository } from "../../../application/repositories/BreakdownRepository.ts";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity.ts";
import { BreakdownNotFoundError } from "../../../domain/errors/BreakdownNotFoundError.ts";

export class BreakdownRepositoryInMemory implements BreakdownRepository {
  public constructor(private breakdowns: BreakdownEntity[]) {}

  public save(breakdown: BreakdownEntity): Promise<void> {
    const index = this.breakdowns.findIndex(
      (breakdown) => breakdown.identifier === breakdown.identifier,
    );
    if (index === -1) {
      this.breakdowns.push(breakdown);
    } else {
      this.breakdowns[index] = breakdown;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<BreakdownEntity[]> {
    return Promise.resolve(this.breakdowns);
  }

  public findOneById(
    id: string,
  ): Promise<BreakdownEntity | BreakdownNotFoundError> {
    const foundBreakdown = this.breakdowns.find((breakdown) => {
      return breakdown.identifier === id;
    });

    return Promise.resolve(foundBreakdown ?? new BreakdownNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.breakdowns = this.breakdowns.filter(
      (breakdown) => breakdown.identifier !== id,
    );
    return Promise.resolve();
  }
}
