export class MotoPartEntity {
    private constructor(
      public readonly identifier: string,
      public readonly clientId: string | null, // Le client peut être null
      public readonly dealerId: string,
      public readonly model: string,
      public readonly registrationNumber: string,
      public readonly status: string,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
    ) {}
  
    public static create(
      clientId: string | null, // Peut être null si le client n'est pas fourni
      dealerId: string,
      model: string,
      registrationNumber: string,
      status: string,
    ) {
      const identifier = crypto.randomUUID(); // Identifiant unique
      const createdAt = new Date(); // Date de création
      const updatedAt = new Date(); // Date de mise à jour
  
      return new MotoPartEntity(
        identifier,
        clientId,
        dealerId,
        model,
        registrationNumber,
        status,
        createdAt,
        updatedAt,
      );
    }
  }
  