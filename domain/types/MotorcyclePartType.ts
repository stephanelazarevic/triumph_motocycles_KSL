export interface AddMotorcyclePartCommand {
  motorcycleId: string,
  partId: string,
}

export interface UpdateMotorcyclePartCommand extends Partial<AddMotorcyclePartCommand> {
}
