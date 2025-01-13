export class MotoEntity {
    private constructor(
      public readonly identifier: string,
      public readonly partId: string, // La pièce associée à la moto
      public readonly model: string,
      public readonly registrationNumber: string,
      public readonly status: string,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
    ) {}
  
    public static create(
      partId: string,
      model: string,
      registrationNumber: string,
      status: string,
    ) {
      const identifier = crypto.randomUUID(); // Génère un identifiant unique
      const createdAt = new Date(); // Date de création
      const updatedAt = new Date(); // Date de dernière mise à jour
  
      return new MotoEntity(
        identifier,
        partId,
        model,
        registrationNumber,
        status,
        createdAt,
        updatedAt,
      );
    }
  }
  