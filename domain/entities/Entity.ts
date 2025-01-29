export abstract class Entity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date = new Date(),
    protected updatedAt: Date = new Date(),
  ) {}

  protected markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}
