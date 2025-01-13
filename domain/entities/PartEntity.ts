export class PartEntity {
    private constructor(
      public readonly identifier: string,
      public readonly commandIdentifier: string,
      public readonly reference: string,
      public readonly type: string,
      public readonly price: number,
      public readonly stockQuantity: number,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
    ) {}
  
    public static create(
      commandIdentifier: string,
      reference: string,
      type: string,
      price: number,
      stockQuantity: number
    ) {
      const identifier = crypto.randomUUID();
      const createdAt = new Date();
      const updatedAt = new Date();
  
      return new PartEntity(
        identifier,
        commandIdentifier,
        reference,
        type,
        price,
        stockQuantity,
        createdAt,
        updatedAt,
      );
    }
  }