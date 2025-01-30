import { AddUserCommand } from "./UserType.ts";

export type AddClientCommand = AddUserCommand & {
  dealerId: string;
};

export type UpdateClientDealerCommand = {
  dealerId: string;
};
