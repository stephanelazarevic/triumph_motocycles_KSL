export interface AddTestRideCommand {
  clientId: string,
  motorcycleId: string,
  date: Date,
  feedback: String,
  isCompleted: boolean,
}  

export interface updateTestRideCommand extends Partial<AddTestRideCommand> {
}
