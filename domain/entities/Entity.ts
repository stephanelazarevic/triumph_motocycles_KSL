export abstract class Entity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date = new Date(),
    protected updatedAt: Date = new Date(),
    public deletedAt: Date | null = null,
  ) {}

  public markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}
