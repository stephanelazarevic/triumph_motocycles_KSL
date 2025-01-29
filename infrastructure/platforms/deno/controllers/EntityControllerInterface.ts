export interface EntityControllerInterface {
    getAll(): Promise<Response>;
    getById(request: Request): Promise<Response>;
    create(request: Request): Promise<Response>;
    update(request: Request): Promise<Response>;
    delete(request: Request): Promise<Response>;
}