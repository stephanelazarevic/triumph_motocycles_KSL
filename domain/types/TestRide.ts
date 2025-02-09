export interface AddTestRideCommand {
  clientId: string,
  motorcycleId: string,
  date: Date,
  feedback: string,
  isCompleted: boolean,
}  

export interface updateTestRideCommand extends Partial<AddTestRideCommand> {
}
