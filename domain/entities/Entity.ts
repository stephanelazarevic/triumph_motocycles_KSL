export abstract class Entity {
  constructor(
    public readonly id: string = crypto.randomUUID(),
    public readonly createdAt: Date = new Date(),
    protected updatedAt: Date = new Date(),
    protected deletedAt: Date | null = null,
  ) {}

  public markAsUpdated(): void {
    this.updatedAt = new Date();
  }

  public markAsDeleted(): void {
    this.deletedAt = new Date();
  }
}
