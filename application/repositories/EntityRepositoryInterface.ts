export interface EntityRepositoryInterface<T> {
    save(entity: T): Promise<void>;
    findAll(): Promise<T[]>;
    findOneById(id: string): Promise<T | Error>;
    delete(id: string): Promise<void>;
}