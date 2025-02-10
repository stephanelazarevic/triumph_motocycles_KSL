export interface AddDriverCommand {
  enterpriseId: string,
  motorcycleId: string,
  firstname: string,
  lastname: string,
  licenseNumber: string,
  phoneNumber: string,
  emailAddress: string
}

export interface updateDriverCommand extends Partial<AddDriverCommand> {
}
